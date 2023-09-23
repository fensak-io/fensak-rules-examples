import { assertEquals } from "https://deno.land/std@0.197.0/testing/asserts.ts";
import {
  compileRuleFn,
  IGitHubRepository,
  patchFromGitHubPullRequest,
  RuleFnSourceLang,
  RuleLogMode,
  runRule,
} from "https://raw.githubusercontent.com/fensak-io/fensak/7df207f8f1e5ea1b76e338cf309dc1e9516c9c9d/mod.ts";
import { Octokit } from "npm:@octokit/rest@^20.0.0";

const __dirname = new URL(".", import.meta.url).pathname;
const ruleFn = compileRuleFn(
  await Deno.readTextFile(`${__dirname}/rules.ts`),
  RuleFnSourceLang.Typescript,
);
const octokit = new Octokit();
const testRepo: IGitHubRepository = {
  owner: "fensak-test",
  name: "test-fensak-rules-engine",
};
const opts = { logMode: RuleLogMode.Console };

Deno.test("No changes", async () => {
  const result = await runRule(ruleFn, [], opts);
  assertEquals(result.approve, true);
});

Deno.test("Change to subapp version", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/1
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 1);
  const result = await runRule(ruleFn, patches.patchList, opts);
  assertEquals(result.approve, true);
});

Deno.test("Change to subapp version, but not semantic", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/26
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 26);
  const result = await runRule(ruleFn, patches.patchList, opts);
  assertEquals(result.approve, false);
});

Deno.test("Change to multiple config", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/2
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 2);
  const result = await runRule(ruleFn, patches.patchList, opts);
  assertEquals(result.approve, false);
});

Deno.test("Change to an unrelated file", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/11
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 11);
  const result = await runRule(ruleFn, patches.patchList, opts);
  assertEquals(result.approve, false);
});

Deno.test("Remove config file", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/22
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 22);
  const result = await runRule(ruleFn, patches.patchList, opts);
  assertEquals(result.approve, false);
});
