# Require source branch of PR to be main when merging to release

This folder contains an example Fensak required rule that ensures that all PRs open against a release branch (`release`)
are opened from the trunk (`main`).

Note that this folder only contains a required rule, as it is meant to be a strict check against all PRs as opposed to
an automated approval.


## Running the tests

The tests are written in [TypeScript](https://www.typescriptlang.org/) targeting [Deno](https://deno.land/). To run the
tests for this rule, install deno and use the following flags:

```
deno test --allow-read --allow-env --allow-net
```
