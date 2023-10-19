function main(_inp, metadata) {
  if (metadata.targetBranch === "release") {
    // Reject if source branch is not `main`;
    return metadata.sourceBranch === "main";
  }

  // Allow all other PRs.
  return true;
}
