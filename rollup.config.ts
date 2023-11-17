import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";
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
      name: "YlComponents",
      globals: {
        vue: "Vue",
      },
    },
  ],
  plugins: [
    vue({
      css: false,
      data: { scss: "@import 'src/assets/styles/base/index';" },
    }),
    nodeResolve({ extensions: [".vue", ".ts"] }),
    typescript({
      exclude: ["rollup.config.ts"],
    }),
    commonjs(),
    postcss(),
  ],
});
