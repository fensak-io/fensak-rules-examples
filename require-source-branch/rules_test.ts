import { assertEquals } from "https://deno.land/std@0.202.0/testing/asserts.ts";

import {
  IGitHubRepository,
  patchFromGitHubPullRequest,
  RuleLogMode,
  runRule,
} from "npm:@fensak-io/reng@^1.3.0";
import { Octokit } from "npm:@octokit/rest@^20.0.0";

const __dirname = new URL(".", import.meta.url).pathname;
const requiredRuleFn = await Deno.readTextFile(
  `${__dirname}/required_rules.js`,
);
const octokit = new Octokit({
  auth: Deno.env.get("GITHUB_API_TOKEN"),
});
const testRepo: IGitHubRepository = {
  owner: "fensak-test",
  name: "test-fensak-rules-engine",
};
const opts = { logMode: RuleLogMode.Console };

Deno.test("any branch against main is allowed", async () => {
  const result = await runRule(requiredRuleFn, [], {
    sourceBranch: "foo",
    targetBranch: "main",
    linkedPRs: [],
  }, opts);
  assertEquals(result.approve, true);
});

Deno.test("any branch against other branches are allowed", async () => {
  const result = await runRule(requiredRuleFn, [], {
    sourceBranch: "foo",
    targetBranch: "bar",
    linkedPRs: [],
  }, opts);
  assertEquals(result.approve, true);
});

Deno.test("main branch against release branch is allowed", async () => {
  const result = await runRule(requiredRuleFn, [], {
    sourceBranch: "main",
    targetBranch: "release",
    linkedPRs: [],
  }, opts);
  assertEquals(result.approve, true);
});

Deno.test("other branches against release branch is NOT allowed", async () => {
  const result = await runRule(requiredRuleFn, [], {
    sourceBranch: "foo",
    targetBranch: "release",
    linkedPRs: [],
  }, opts);
  assertEquals(result.approve, false);
});

Deno.test("GitHub pulled PR against main works", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/1
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 1);
  const result = await runRule(
    requiredRuleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  assertEquals(result.approve, true);
});
