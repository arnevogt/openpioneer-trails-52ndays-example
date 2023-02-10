/**
 * @vitest-environment jsdom
 */
import { renderComponent, renderComponentShadowDOM } from "@open-pioneer/test-utils/web-components";
import { waitFor } from "@testing-library/dom";
import { Component, createElement } from "react";
import { expect, it, describe } from "vitest";
import { createCustomElement } from "./CustomElement";
import { usePropertiesInternal } from "./react-integration";

describe("simple rendering", function () {
    const SIMPLE_STYLE = ".test { color: red }";
    const SIMPLE_ELEM = createCustomElement({
        component: () => createElement("div", { className: "test" }, "hello world"),
        styles: SIMPLE_STYLE
    });
    customElements.define("simple-elem", SIMPLE_ELEM);

    it("should return html element", () => {
        expect(new SIMPLE_ELEM()).toBeInstanceOf(HTMLElement);
    });

    it("should render html", async () => {
        const { queries } = await renderComponentShadowDOM("simple-elem");
        const div = await queries.findByText("hello world");
        expect(div.className).toBe("test");
    });

    it("should render use styles", async () => {
        const { shadowRoot } = await renderComponentShadowDOM("simple-elem");
        const style = shadowRoot.querySelector("style")!;
        expect(style.innerHTML).toBe(SIMPLE_STYLE);
    });

    it("should clean up its content when removed from the dom", async () => {
        const { node, shadowRoot, innerContainer } = await renderComponentShadowDOM("simple-elem");
        node.remove();

        // Wait until divs are gone
        await waitFor(() => {
            const div = innerContainer.querySelector("div");
            if (div) {
                throw new Error("content still not destroyed");
            }
        });

        expect(shadowRoot.innerHTML).toBe("");
    });
});

it("explicitly setting the shadow dom mode hides the shadow root", async () => {
    function TestComponent() {
        return createElement("span", undefined, "Hello World");
    }

    const elem = createCustomElement({
        component: TestComponent,
        openShadowRoot: false
    });
    const { node } = await renderComponent(elem);
    expect(node.shadowRoot).toBeNull();
});

it("should render test component with attribute 'name'", async () => {
    class TestComponent extends Component<Record<string, string>> {
        render() {
            return createElement("span", this.props, `Hello ${this.props.name}`);
        }
    }

    const attributeValue = "test";
    const elem = createCustomElement({
        component: TestComponent,
        attributes: ["name"]
    });
    const { node, queries } = await renderComponentShadowDOM(elem);
    node.setAttribute("name", attributeValue);

    const span = await queries.findByText(`Hello ${attributeValue}`);
    expect(span.tagName).toBe("SPAN");
});

it("should allow customization of package properties", async () => {
    const elem = createCustomElement({
        component: function TestComponent() {
            const properties = usePropertiesInternal("test");
            return createElement("span", undefined, properties.greeting as string);
        },
        packages: {
            test: {
                name: "test",
                properties: {
                    greeting: {
                        value: "Hello World"
                    }
                }
            }
        },
        properties: {
            test: {
                greeting: "Hello User"
            }
        }
    });

    const { queries } = await renderComponentShadowDOM(elem);
    const span = await queries.findByText("Hello User");
    expect(span.tagName).toBe("SPAN");
});

it("should allow customization of package properties through a callback", async () => {
    const elem = createCustomElement({
        component: function TestComponent() {
            const properties = usePropertiesInternal("test");
            return createElement("span", undefined, properties.greeting as string);
        },
        packages: {
            test: {
                name: "test",
                properties: {
                    greeting: {
                        value: "Hello World"
                    }
                }
            }
        },
        properties: {
            test: {
                greeting: "Hello User"
            }
        },
        // properties from this callback take precedence
        async resolveProperties() {
            return {
                test: {
                    greeting: "Bye User"
                }
            };
        }
    });

    const { queries } = await renderComponentShadowDOM(elem);
    const span = await queries.findByText("Bye User");
    expect(span.tagName).toBe("SPAN");
});
