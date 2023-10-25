# Auto approve based on changes in a config file

This folder contains an example Fensak rule that checks for changes to a config file (JSON, YAML, or TOML). The rule will only allow the
change if all of the following is true:

- The change is to the file `appversions.json` file.
- Only the `subapp_version` key is updated.
- The `subapp_version` key has been updated to a semantic version.

Note that unlike [the json-config example](../json-config) and its variants, this example uses the provided object diff
to implement the rules.


## Running the tests

The tests are written in [TypeScript](https://www.typescriptlang.org/) targeting [Deno](https://deno.land/). To run the
tests for this rule, install deno and use the following flags:

```
deno test --allow-read --allow-env --allow-net
```
