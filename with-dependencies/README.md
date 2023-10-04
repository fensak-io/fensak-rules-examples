# Example rule with dependencies

This folder contains an example Fensak rule that has a dependency ([lodash](https://lodash.com/)). This example uses
[rollup](https://rollupjs.org/) to embed the dependency into a single js rule file so that it can work on Fensak.


## Notes on source control

Typically compiled files from a build are not committed to source control. Instead, they are packaged and shipped to the
final destination at build time (e.g., NPM or the app container). However, in this case it is **necessary to check in
the compiled rules file** since Fensak pulls the rules code directly from the repository.

This adds a risk where you could end up making updates to the rules file and neglect to update the compiled version. To
handle this, we recommend either adding a test case, a build check, or a precommit hook that checks to make sure the
compiled version matches the latest source by compiling and doing a diff.


## Running the tests

The tests are written in [TypeScript](https://www.typescriptlang.org/) targeting [Deno](https://deno.land/). To run the
tests for this rule, install deno and use the following flags:

```
deno test --allow-read --allow-env --allow-net
```
