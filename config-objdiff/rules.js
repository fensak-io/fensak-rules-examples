function main(inp, _metadata) {
  if (inp.length == 0) {
    console.log("Accepting since no changes.");
    return true;
  } else if (inp.length > 1) {
    // More than one file was updated, which means not just appversions.json was changed so reject.
    console.log("Rejecting since more than one file was updated.");
    return false;
  }

  var patch = inp[0];
  if (patch.op != "modified") {
    console.log("Rejecting since the whole file was updated.");
    return false;
  }
  if (patch.diff.length > 1) {
    console.log("Rejecting since more than one section of the file was updated.");
    return false;
  }
  // NOTE
  // This assumes json, but the following code can work with any of the following config file formats:
  // - json
  // - json5
  // - yaml
  // - toml
  if (patch.path != "appversions.json") {
    console.log("Rejecting since the update was to an unexpected json file.");
    return false;
  }

  var objDiff = patch.objectDiff;
  if (objDiff === null) {
    // objDiff can be null when the config file is not parsable.
    console.log("Rejecting since the config file was not parsable");
    return false;
  }
  if (objDiff.diff.length !== 1) {
    console.log("Rejecting since too many fields were updated");
    return false;
  }

  var diff = objDiff.diff[0];
  if (diff.type !== "CHANGE") {
    console.log("Rejecting since either a new key was added to the config, or an existing key was removed");
    return false;
  }
  if (diff.path.length > 1) {
    console.log("Rejecting since more than one object key was updated");
    return false;
  }
  if (diff.path[0] !== "subapp") {
    console.log("Rejecting since object key other than approved key (subapp) was updated");
    return false;
  }

  var semverRE = /^v\d+\.\d+\.\d+$/;
  if (!semverRE.test(diff.value)) {
    console.log("Rejecting since subapp key was updated to a non-semver value");
    return false;
  }

  console.log("Accepting since only subapp key was updated and it maps to a semver");
  return true;
}
