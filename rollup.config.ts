import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import vue from "rollup-plugin-vue";

export default defineConfig({
  external: ["vue", "@dcloudio/uni-app"],
  input: "src/index.ts",
  output: [
    {
      format: "es",
      dir: "lib/es",
    },
    {
      format: "umd",
      dir: "lib/umd",
      name: "YlCompontents",
      globals: {
        vue: "Vue",
      },
    },
  ],
  plugins: [
    nodeResolve({ extensions: [".vue", ".ts"] }),
    typescript({ compilerOptions: { declaration: true } }),
    commonjs(),
    vue(),
  ],
});
