import find from 'lodash.find';

// If there are any changes that are not updates to the README, then reject.
function main(inp) {
  const found = find(
    inp,
    (x) => {
      return x.op != "modified" || x.path != "README.md";
    }
  );
  return !found
}

// NOTE
// This is necessary to avoid scope hoisting removing the main function from the final source.
window.main = main
