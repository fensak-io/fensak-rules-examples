# Fensak GO Rules Examples

This repository contains examples of auto-approve rules for Fensak GO. Each folder represents an example use case and
contains:

- `README.md` describing the use case.
- `rules.js` or `rules.ts` containing the implementation of the rule.
- `rules_test.ts` containing test cases for the rule. Use it as a guideline for how to test your own code.

## Running the tests

The tests are written in [Typescript](https://www.typescriptlang.org/) targeting [Deno](https://deno.land/). To run the
tests for the rules, install deno and use the following flags:

```
deno test --allow-read --allow-env --allow-net
```
