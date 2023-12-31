import { assertEquals } from "https://deno.land/std@0.202.0/testing/asserts.ts";

import {
  emptyChangeSetMetadata,
  patchFromGitHubPullRequest,
  Repository,
  RuleLogMode,
  runRule,
} from "npm:@fensak-io/reng@^2.0.0";
import { Octokit } from "npm:@octokit/rest@^20.0.0";

const __dirname = new URL(".", import.meta.url).pathname;
const ruleFn = await Deno.readTextFile(`${__dirname}/rules.js`);
const octokit = new Octokit({
  auth: Deno.env.get("GITHUB_API_TOKEN"),
});
const testRepo: Repository = {
  owner: "fensak-test",
  name: "test-fensak-rules-engine",
};
const opts = { logMode: RuleLogMode.Console };

Deno.test("No changes", async () => {
  const result = await runRule(ruleFn, [], emptyChangeSetMetadata, opts);
  assertEquals(result.approve, true);
});

Deno.test("Change to subapp version", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/1
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 1);
  const result = await runRule(
    ruleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  assertEquals(result.approve, true);
});

Deno.test("Change to subapp version, but not semantic", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/26
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 26);
  const result = await runRule(
    ruleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  assertEquals(result.approve, false);
});

Deno.test("Change to multiple config", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/2
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 2);
  const result = await runRule(
    ruleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  assertEquals(result.approve, false);
});

Deno.test("Change to an unrelated file", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/11
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 11);
  const result = await runRule(
    ruleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  assertEquals(result.approve, false);
});

Deno.test("Remove config file", async () => {
  // View PR at
  // https://github.com/fensak-test/test-fensak-rules-engine/pull/22
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 22);
  const result = await runRule(
    ruleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  assertEquals(result.approve, false);
});
