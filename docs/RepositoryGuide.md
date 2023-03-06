# Guide to the repository

## Overview

The following figure gives a brief overview of the repository structure.

<!-- tree -L 2 --gitignore --dirsfirst -->

```
starter
├── docs                    -- Documentation
├── src                     -- Contains project code
│   ├── apps                -- Apps go here
│   ├── packages            -- Packages that can be used by apps
│   ├── samples             -- Example sites, apps and packages
│   ├── types               -- TypeScript support files
│   ├── sites               -- Additional .html sites
│   └── index.html          -- Main HTML entry point
├── .editorconfig           -- Common text file settings (encoding, line length)
├── .eslintignore           -- Lists files ignored by ESLint
├── .eslintrc               -- ESLint configuration file
├── .gitignore              -- Lists files ignored by git
├── .prettierrc             -- Prettier configuration file
├── package.json            -- Dependencies of the root package (mostly development tools)
├── pnpm-lock.yaml          -- Package manager lockfile
├── pnpm-workspace.yaml     -- Workspaces configuration file for pnpm
├── tsconfig.json           -- Main TypeScript configuration file for code that runs in the browser
├── tsconfig.node.json      -- Additional TypeScript configuration file for files running in Node
└── vite.config.ts          -- Vite configuration file
```

## Node scripts

Some frequently used tasks are implemented as scripts in the root `package.json` file.
They should be invoked via pnpm: `pnpm run <SCRIPT_NAME>` (`run` is optional if the script name is unambiguous).

### `pnpm run dev`

Launches [Vite's](https://vitejs.dev/) local development server.
The main configuration file for vite is `vite.config.ts`.

### `pnpm run check-types`

Runs the [TypeScript compiler](https://www.typescriptlang.org/) to detect problems during development.

### `pnpm run watch-types`

Starts the [TypeScript compiler](https://www.typescriptlang.org/) in watch mode to detect problems during development.
It is recommended to run this script alongside the `dev` server.

### `pnpm run test`

Starts [Vitest](https://vitest.dev/) to run all automated tests.
Vitest will automatically watch all source code files and will rerun tests during development whenever it detects changes.

### `pnpm run build`

Builds the project as a static site.
Generated files are output into the `dist/www` directory.
The main configuration file for vite is `vite.config.ts`.

### `pnpm run build-docs`

Builds the project's API documentation.
Documentation is generated using [TypeDoc](https://typedoc.org/) and is configured in the main `tsconfig.json` (key `"typedocOptions"`).
The API documentation is written into `dist/docs`.

### `pnpm run build-license-report`

Create a license report for dependencies used by the project.
The report is written to `dist/license-report.html`.
The source code for report generation is located in `support/create-license-report.ts`.
Configuration happens via `support/license-config.yaml`.

### `pnpm run preview`

Starts a local http server serving the contents of the `dist/www` directory.

### `pnpm run clean`

Removes files that were created during the build (e.g. the `dist` directory).

### `pnpm run lint`

Runs [ESLint](https://eslint.org/) on all source code files to detect problems.
Simple errors can be fixed automatically by running `pnpm run lint --fix`.
ESLint is configured via the `.eslintrc` file.

### `pnpm run prettier`

Runs [Prettier](https://prettier.io/) on all source code files for automated (re-) formatting.
Prettier and ESLint are integrated (see `.eslintrc`), so prettier rules are also respected when linting.

### `pnpm audit`

Checks for known security issues with the installed packages. (Will also be checked with a nightly github action job)

### Miscellaneous tools

Installed node tools can be invoked by running `pnpm exec <TOOL_AND_OPTIONS>` (once again, the `exec` is optional).

## Common workflows

### Adding a dependency

Do install a shared build dependency (a vite plugin for example), run `pnpm add -D -w <PACKAGE_NAME>`.
`-D` will include the package as a devDependency, and `-w` will add it to the workspace root's `package.json`.

To add a dependency to a workspace package or app, execute `pnpm add PACKAGE_NAME` from the package or app directory.

You can also add the dependency manually by editing the `package.json` file directory.
Keep in mind to execute `pnpm install` to update the lockfile after you're done with editing.

### Updating a dependency

TBD

### Keeping dependency versions in sync

TBD

## Concepts

### Package manager: PNPM

Please use [`pnpm`](https://pnpm.io) instead of `npm` to manage dependencies in this repository.

Here is a list of some common commands you are likely to need:

-   `pnpm install`: Install local dependencies, for example after versions changed or a new local package has been created.
-   In a package directory: `pnpm add <DEP>`.
    Adds the dependency to the package and installs it. Use `-D` for devDependencies.
    `pnpm remove` removes a dependency again.
-   `pnpm -w <COMMAND>`: run the command in the workspace root instead of the local package.
-   `pnpm run <SCRIPT>`: runs the script from the `package.json`.
-   `pnpm exec <COMMAND>`: runs the CLI command (should be installed in node_modules), e.g. `pnpm exec -w tsc --noEmit`.

### Monorepo

We use [PNPM's workspace support](https://pnpm.io/workspaces) to manage packages in our repository.
All node packages matching the patterns configured in the `pnpm-workspace.yaml` file are included in the workspace.
Workspace packages may reference each other.

For example, the following `package-a` will be able to use `package-b`:

```jsonc
// package.json
{
    "name": "package-a",
    "dependencies": {
        "package-b": "workspace:^"
    }
}
```

`pnpm install` will resolve dependencies such as these by linking the packages to each other.
For example, `package-a/node_modules/package-b` will be a link to `package-b`'s actual location in the workspace.

### TypeScript

As a general rule, most code should be written in TypeScript.
The usage of typescript has many advantages.
It protects against bugs, improves the developer experience (autocompletion, early detection of problems, etc.) and
also ensures that type definitions and documentation for reusable libraries or bundles can be generated with little effort.

However, usage of JavaScript _is_ supported.

### UI Component Framework

We are using [Chakra UI](https://chakra-ui.com/) as our base framework to develop user interfaces.
Please import all chakra components from the `@open-pioneer/chakra-integration` package (instead of `@chakra-ui/*`).
This gives us the opportunity to set sensible defaults for some advanced use cases (such as shadow dom support).

Example:

```jsx
import { Button } from "@open-pioneer/chakra-integration";

function MyComponent() {
    return <Button>Hello World</Button>;
}
```

### Vite

[Vite](https://vitejs.dev/) is our main build tool and development server.
Custom functionalities (such as our specific pioneer-framework package support) are developed on top of Vite via plugins.

Vite reads the configuration file `vite.config.ts` on start, which can be customized to your liking
(see [docs](https://vitejs.dev/config/)).
However, the pioneer and react plugin should not be removed from the configuration.

#### Supported Browsers

The vite config is preconfigured to support a set of common browsers ("targets", see [docs](https://vitejs.dev/config/build-options.html#build-target)).
This option influences the features used by the compiled JavaScript and CSS code.
Note that this only changes the set of _language features_ used by the output (e.g. `async`, `class`)
and not the set of Browser APIs used (that would require additional polyfills).

By default, vite assumes modern browsers with support for modules.
It is possible to support even older browsers using vite's [legacy plugin](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy).

### Testing

[Vitest](https://vitest.dev/) is used to write automated tests.
To create new tests for a source code file, simply add a `*.test.ts` (or `.tsx`, `.js`, etc.) file next to it.
It will then be automatically picked up by vitest.

Use `pnpm run test` to run the test suite.

Please refer to the [official documentation](https://vitest.dev/guide/) for more information.

#### UI Tests

Vitest can be used to write simple UI tests by simulating a browser environment.
In your test file, configure the vitest environment to `jsdom` (or `happy-dom`, see [Reference](https://vitest.dev/guide/environment.html)):

```js
// SomeClass.test.js
// @vitest-environment jsdom
/* ... tests ... */
```

Web Components or React Components can then be rendered into the simulated DOM for testing.
It is often more convenient (and faster) to test the react components instead of the complete web component application since there are fewer moving parts and fewer dependencies to mock.

However, testing the final application can be great too for automated acceptance tests etc.

You can take a look at the UI tests of the runtime package (`@open-pioneer/runtime`) for some examples.

Recommended libraries:

-   `@testing-library/react` (or `/dom`): <https://testing-library.com/>
-   `react-dom/test-utils`: <https://reactjs.org/docs/test-utils.html>
-   Our own test utils in `@open-pioneer/test-utils`

#### Test utilities

The package `@open-pioneer/test-utils` provides helpers to test components of a pioneer application:

-   The application itself (that is, the web component).
    Web components can be mounted in the DOM and their children can be searched.
-   React components with dependencies to services, properties etc.
    Test dependencies and data can be provided in such a way that the component renders into the DOM without any changes to the component's implementation.
-   Service instances can be created with test references and properties.

### Linting and formatting

We use [Prettier](https://prettier.io/) to handle automatic source code formatting.
This keeps code readable with reasonable defaults and also ensures that we don't waste time with unproductive style discussions.
Prettier is configured by the `.prettierrc` file and it also respects parts of the `.editorconfig` file.
It can be integrated into most modern IDEs to keep automatically keep edited files formatted properly.

[ESLint](https://eslint.org/) runs within the dev server (as a vite plugin) and when pushing to the GitHub repository (within the GitHub actions workflow).
It checks the code against configured rules (see `.eslintrc`) and fails the build when it detects a code style violation.
ESLint helps to detect minor style issues (e.g. missing semicolons) and outright programming errors (e.g. wrong usage of react hooks).

### Web component integration

It is possible to implement a communication between the app which is a web component and the surrounding site.
The outer site can call api methods implemented in the app to trigger action in the web component
and on the other hand the web component can emit events to be received by the outer site.
Both techniques are described in the following.

#### Web component API

It is possible to provide API functions that can be called from the outer site to trigger actions in the web component.
This allows the surrounding site to control the app.

To use methods provided by the API in the surrounding site, call the `when()` method on the app.
It resolves to the app's API when the application has started.
Thereupon it is possible to call the provided methods on the returned API instance.

For Example:

```html
<!DOCTYPE html>
<html lang="en">
    ...
    <body>
        <api-app id="app"></api-app>
        <script type="module" src="example-path/app.ts"></script>
    </body>
    <script>
        customElements.whenDefined("api-app").then(() => {
            const app = document.getElementById("app");
            app.when().then((api) => {
                api.changeText("This is a test text.");
            });
        });
    </script>
</html>
```

To provide API functions a service providing `"integration.ApiExtension"` needs to be implemented.
The service must implement the `ApiExtension` interface from `@open-pioneer/integration`.
Functions returned from `getApiMethods()` will automatically be added as methods on the web component's API object.

For example:

```js
// build.config.mjs
import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    services: {
        TextApiExtension: {
            provides: "integration.ApiExtension",
            references: {
                textService: "api-app.TextService"
            }
        },
        TextService: {
            provides: "api-app.TextService"
        },
        ...
    },
    ...
});
```

```ts
// TextApiExtension.ts
import { ServiceOptions } from "@open-pioneer/runtime";
import { ApiExtension } from "@open-pioneer/integration";
import { TextService } from "./TextService";

interface References {
    textService: TextService;
}

// implement ApiExtension interface
export class TextApiExtension implements ApiExtension {
    private textService: TextService;

    constructor(opts: ServiceOptions<References>) {
        this.textService = opts.references.textService;
    }

    // returns a set of methods that will be added to the web component's API.
    async getApiMethods() {
        return {
            // changeText method is available
            changeText: (text: string) => {
                this.textService.setText(text);
            }
        };
    }
}
```

#### Web component events

It is also possible to emit browser events from inside the web component.
These events will be dispatched from the application's host element.

You can reference the interface `"integration.ExternalEventService"` (implemented by package `@open-pioneer/integration
`) to obtain the event service:

```js
// build.config.mjs
export default defineBuildConfig({
    services: {
        YourService: {
            references: {
                eventService: "integration.ExternalEventService"
            }
        }
    }
});
```

```js
// In your service / UI
eventService.emitEvent("my-custom-event", {
    // ... data
});
```

```js
// In the host site
const app = document.getElementById("app");
app.addEventListener("my-custom-event", (event) => {
    console.log(event);
});
```

See the package documentation of `@open-pioneer/integration` for more details.