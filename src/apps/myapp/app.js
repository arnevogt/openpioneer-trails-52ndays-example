/* eslint-disable header/header */
import { createCustomElement } from "@open-pioneer/runtime";
import * as appMetadata from "open-pioneer:app";
import { MyApp } from "./MyApp";

const Element = createCustomElement({
    component: MyApp,
    appMetadata
});

customElements.define("my-app-element", Element);
