import typescript from "@rollup/plugin-typescript";

export default {
  input: "./index.ts",
  output: {
    sourcemap: true,
    dir: "output",
    format: "es",
  },
  plugins: [typescript()],
};
