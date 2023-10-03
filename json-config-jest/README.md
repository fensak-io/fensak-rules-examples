# Auto approve based on changes in a JSON config file (Typescript)

This folder contains the same example as [json-config-ts](/json-config-ts), but uses NodeJS and
[jest](https://jestjs.io/) for testing instead of Deno.


## Running the tests

The tests are written in [TypeScript](https://www.typescriptlang.org/) with [jest](https://jestjs.io/). To run the tests
for this rule, install dependencies and use the following flags:

```
pnpm install
pnpm test
```

> **NOTE**
>
> You must use [pnpm](https://pnpm.io/) as the package manager when using `reng` as a library, due to one of the
> dependencies [JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter) not having a valid `package.json` file.
