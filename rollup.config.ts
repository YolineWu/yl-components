import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";
import postcss from "rollup-plugin-postcss";
import { glob } from "glob";

// 加载 `package.json` 文件内容
import packageInfo from "./package.json" assert { type: "json" };
import path from "path";
import { fileURLToPath } from "url";
import { PreRenderedChunk } from "rollup";

// 在每个文件开始的地方添加的内容
const banner = `
/**
 * ${packageInfo.name} library v${packageInfo.version}
 * github: https://github.com/YolineWu/yl-components
 */
`;

// 主入口文件
const indexEntries = { index: "src/index.ts" };
// `.vue` 入口文件
const vueEntries = Object.fromEntries(
  glob.sync("src/**/*.vue").map((file) => [
    // 入口文件名
    path.relative("src/components", file),
    fileURLToPath(new URL(file, import.meta.url)),
  ]),
);

/**
 * 定义 `rollup` 配置
 */
export default defineConfig([
  // 生成 `es` js文件
  {
    external: ["vue", "vuex", "@dcloudio/uni-app"],
    input: { ...indexEntries, ...vueEntries },
    preserveEntrySignatures: "strict",
    strictDeprecations: true,
    output: {
      format: "es",
      dir: "./",
      sourcemap: "inline",
      assetFileNames: "lib/es/assets/[name]-[hash][extname]",
      chunkFileNames: "lib/es/[name]-[hash].mjs",
      entryFileNames: (info: PreRenderedChunk) => {
        return path.extname(info.name) === ".vue"
          ? "components/[name].mjs"
          : "lib/es/[name].mjs";
      },
      banner,
    },
    plugins: [
      vue({
        css: false,
        data: { scss: "@import 'src/assets/styles/base/index';" },
      }),
      nodeResolve({ extensions: [".vue", ".ts", ".tsx"] }),
      typescript({
        useTsconfigDeclarationDir: true,
        exclude: ["rollup.config.ts"],
      }),
      commonjs(),
      postcss(),
    ],
  },
  // 生成 `umd` js文件
  {
    external: ["vue", "vuex", "@dcloudio/uni-app"],
    input: indexEntries,
    preserveEntrySignatures: "strict",
    strictDeprecations: true,
    output: {
      format: "umd",
      dir: "lib/umd",
      name: "YlComponents",
      sourcemap: "inline",
      banner,
      globals: {
        vue: "Vue",
      },
    },
    plugins: [
      vue({
        css: false,
        data: { scss: "@import 'src/assets/styles/base/index';" },
      }),
      nodeResolve({ extensions: [".vue", ".ts", ".tsx"] }),
      typescript({
        exclude: ["rollup.config.ts"],
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
            composite: false,
            rootDir: "./",
          },
        },
      }),
      commonjs(),
      postcss(),
    ],
  },
]);
