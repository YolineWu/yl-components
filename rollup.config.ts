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
      dir: "lib/es",
      exports: "named",
    },
    {
      format: "umd",
      dir: "lib/umd",
      name: "YlCompontents",
      exports: "named",
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
      preprocessOptions: {
        scss: {
          additionalData: `@import 'src/assets/styles/index';`,
        },
      },
      templatePreprocessOptions: {
        isProduction: true,
      },
    }),
    commonjs(),
    postcss(),
  ],
});
