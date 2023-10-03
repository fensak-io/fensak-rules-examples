# Auto approve based on changes in a JSON config file (Typescript)

This folder contains the same example as [json-config](/json-config), but uses `compileRuleFn` function to compile
Typescript down to ES5.


## Running the tests

The tests are written in [TypeScript](https://www.typescriptlang.org/) targeting [Deno](https://deno.land/). To run the
tests for this rule, install deno and use the following flags:

```
deno test --allow-read --allow-env --allow-net
```
