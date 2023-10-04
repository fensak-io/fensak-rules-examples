import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";

export default {
  input: "rules.js",
  output: {
    file: "rules_compiled.js",
    format: "cjs",
  },
  plugins: [
    resolve(),
    commonjs(),
    getBabelOutputPlugin({
      presets: ["@babel/preset-env"],
    }),
  ],
};
