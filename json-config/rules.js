function main(inp, _metadata) {
  if (inp.length == 0) {
    // No files updated, so approve.
    console.log("Accepting since no changes.");
    return true;
  } else if (inp.length > 1) {
    // More than one file was updated, which means not just appversions.json was changed so reject.
    console.log("Rejecting since more than one file was updated.");
    return false;
  }

  var patch = inp[0];
  if (patch.op != "modified") {
    // The whole file was updated, so reject.
    console.log("Rejecting since the whole file was updated.");
    return false;
  }
  if (patch.diff.length > 1) {
    // More than one section was updated, so reject.
    console.log("Rejecting since more than one section of the file was updated.");
    return false;
  }
  if (patch.path != "appversions.json") {
    // Unexpected json file was updated, so reject.
    console.log("Rejecting since the update was to an unexpected json file.");
    return false;
  }

  var hunk = patch.diff[0];
  var diffs = hunk.diffOperations.filter(function (d) {
    return d.op !== "untouched";
  });
  if (diffs.length == 0) {
    // No real updates made to the file, so approve.
    console.log("Accepting since no changes.");
    return true;
  } else if (diffs.length > 1) {
    // More than one line was updated, so reject.
    console.log("Rejecting since more than one line was updated.");
    return false;
  }

  var d = diffs[0];
  if (d.op !== "modified") {
    // A line was inserted, or removed from the config, which means it's not just a change to a single app version
    // config. Reject.
    console.log("Rejecting since change was not a modification to an existing line.");
    return false;
  }

  var subappUpdateRE = /^\s*"subapp": "v\d+\.\d+\.\d+",$/;
  return subappUpdateRE.test(d.newText);
}
