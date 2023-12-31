import { assertEquals } from "https://deno.land/std@0.202.0/testing/asserts.ts";

import {
  compileRuleFn,
  emptyChangeSetMetadata,
  LineOp,
  PatchOp,
  RuleFnSourceLang,
  RuleLogMode,
  runRule,
} from "npm:@fensak-io/reng@^2.0.0";

// NOTE
// we run the test on the compiled rules, not the source rules, since only the compiled version has all the dependencies
// inlined.
const __dirname = new URL(".", import.meta.url).pathname;
const ruleFnSrc = await Deno.readTextFile(`${__dirname}/rules_compiled.js`);
const ruleFn = compileRuleFn(ruleFnSrc, RuleFnSourceLang.ES5);

const opts = { logMode: RuleLogMode.Console };

// Sample patches
const readmePatch = {
  path: "README.md",
  op: PatchOp.Modified,
  additions: 1,
  deletions: 1,
  diff: [{
    originalStart: 1,
    originalLength: 1,
    updatedStart: 1,
    updatedLength: 1,
    diffOperations: [{
      op: LineOp.Modified,
      text: "# Fensak Docs",
      newText: "# Fensak Documentation",
    }],
  }],
  objectDiff: null,
};
const configPatch = {
  path: "config.json",
  op: PatchOp.Modified,
  additions: 1,
  deletions: 1,
  diff: [{
    originalStart: 1,
    originalLength: 1,
    updatedStart: 1,
    updatedLength: 1,
    diffOperations: [{
      op: LineOp.Modified,
      text: '  "appVersion": "v1.0.0",',
      newText: '  "appVersion": "v1.0.1",',
    }],
  }],
  objectDiff: null,
};

Deno.test("No changes", async () => {
  const result = await runRule(ruleFn, [], emptyChangeSetMetadata, opts);
  assertEquals(result.approve, true);
});

Deno.test("Change to readme", async () => {
  const result = await runRule(
    ruleFn,
    [readmePatch],
    emptyChangeSetMetadata,
    opts,
  );
  assertEquals(result.approve, true);
});

Deno.test("Change to readme and config", async () => {
  const result = await runRule(
    ruleFn,
    [readmePatch, configPatch],
    emptyChangeSetMetadata,
    opts,
  );
  assertEquals(result.approve, false);
});
