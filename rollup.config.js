import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";

const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";
const outputFile =
  NODE_ENV === "production" ? "./dist/prod.js" : "./dist/dev.js";

export default [
  {
    input: "src/main.js",
    output: [
      {
        file: outputFile,
        format: "cjs",
        exports: "named",
        sourcemap: !IS_PROD,
        strict: false,
      },
    ],
    external: ["react", "react-dom", "styled-components", /@babel\/runtime/],
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
      }),
      babel({
        babelHelpers: "bundled",
      }),
      // resolve(),
      commonjs(),
      json(),
    ],
  },
  {
    input: "demo/index.js",
    output: [
      {
        exports: "named",
        file: "dist/sample/index.js",
        format: "iife",
        globals:['styled'],
        sourcemap: true,
        strict: false,
      }
    ],
    // external: ["react", "react-dom", "styled-components", /@babel\/runtime/],
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
      }),
      babel({
        babelHelpers: "bundled",
      }),
      commonjs(),
      json(),
      resolve(),
    ],
  }
];
