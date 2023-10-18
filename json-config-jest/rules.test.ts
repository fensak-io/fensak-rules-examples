import fs from "node:fs";

import { expect, test } from "@jest/globals";
import {
  compileRuleFn,
  IGitHubRepository,
  patchFromGitHubPullRequest,
  RuleFnSourceLang,
  RuleLogMode,
  runRule,
} from "@fensak-io/reng";
import { Octokit } from "@octokit/rest";

const ruleFnSrc = fs.readFileSync(`${__dirname}/rules.ts`, "utf8");
const ruleFn = compileRuleFn(ruleFnSrc, RuleFnSourceLang.Typescript);
const octokit = new Octokit();
const testRepo: IGitHubRepository = {
  owner: "fensak-test",
  name: "test-fensak-rules-engine",
};
const opts = { logMode: RuleLogMode.Console };

test("No changes", async () => {
  const result = await runRule(ruleFn, [], { sourceBranch: "foo" }, opts);
  expect(result.approve).toBe(true);
});

test("Change to subapp version", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/1
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 1);
  const result = await runRule(
    ruleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  expect(result.approve).toBe(true);
});

test("Change to subapp version, but not semantic", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/26
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 26);
  const result = await runRule(
    ruleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  expect(result.approve).toBe(false);
});

test("Change to multiple config", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/2
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 2);
  const result = await runRule(
    ruleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  expect(result.approve).toBe(false);
});

test("Change to an unrelated file", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/11
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 11);
  const result = await runRule(
    ruleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  expect(result.approve).toBe(false);
});

test("Remove config file", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/22
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 22);
  const result = await runRule(
    ruleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  expect(result.approve).toBe(false);
});
