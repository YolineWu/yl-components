import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
// @ts-expect-error 没有`d.ts`文件
import vue from "rollup-plugin-vue2";
import postcss from "rollup-plugin-postcss";

export default defineConfig({
  external: ["vue", "@dcloudio/uni-app"],
  input: "src/index.ts",
  output: [
    {
      format: "es",
      exports: "named",
      dir: "lib/es",
      entryFileNames: "[name].mjs",
    },
    {
      format: "umd",
      exports: "named",
      dir: "lib/umd",
      name: "YlCompontents",
      globals: {
        vue: "Vue",
      },
    },
  ],
  plugins: [
    nodeResolve({ extensions: [".vue", ".ts"] }),
    typescript({
      exclude: ["rollup.config.ts"],
    }),
    vue({
      preprocessStyles: true,
      templatePreprocessOptions: {
        isProduction: true,
      },
    }),
    commonjs(),
    postcss(),
  ],
});
