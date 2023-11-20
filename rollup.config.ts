import { RollupOptions, defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import * as sass from "sass";
import { glob } from "glob";
import fs from "fs";
import vue from "rollup-plugin-vue";
import postcss from "rollup-plugin-postcss";

// 加载 `package.json` 文件内容
import packageInfo from "./package.json" assert { type: "json" };
import path from "path";
import { fileURLToPath } from "url";
import { OutputPlugin } from "rollup";

/** vue 入口文件信息 */
type VueEntry = {
  name: string;
  vueFile: string;
  tsFile: string;
  scssFile: string;
};

// 在每个文件开始的地方添加的内容
const blockBanner = `/**
 * ${packageInfo.name} library v${packageInfo.version}
 * github: https://github.com/YolineWu/yl-components
 */
`;
const htmlBanner = `<!-- ${packageInfo.name} library v${packageInfo.version} -->
<!-- github: https://github.com/YolineWu/yl-components -->
`;

// es库位置
const ES_LIB_PATH = "lib/es";
// cjs库位置
const CJS_LIB_PATH = "lib/cjs";
// es文件扩展名
const ES_EXTENSION = ".mjs";
// cjs文件扩展名
const CJS_EXTENSION = ".cjs";
// css文件扩展名
const CSS_EXTENSION = ".css";

// sass 解析选项
const sassOptions: sass.Options<"sync"> = {
  sourceMap: true,
  importers: [
    {
      findFileUrl(url: string): URL {
        return url.startsWith("@")
          ? new URL(path.join("src", url.substring(1)), import.meta.url)
          : new URL(url, import.meta.url);
      },
    },
  ],
};

// 主入口文件
const indexEntries = { index: "src/index.ts" };
/**
 * 处理 vue 组件文件，要求组件分离出 `[组件名].ts` 、`[组件名].scss` 和
 * `[组件名].vue`，该 `[组件名].vue` 必须通过 `<script lang="ts" src="[组件名].ts" />`
 * 引用 `ts` 文件，和通过 `<style lang="scss" src="[组件名].scss" />` 引用 `scss` 文件），
 */
const vueEntries: VueEntry[] = glob
  .sync("src/**/*.vue")
  .reduce<VueEntry[]>((entries, file) => {
    const pathWithoutExt = file.slice(
      0,
      file.length - path.extname(file).length,
    );

    entries.push({
      name: path.relative("src", pathWithoutExt),
      scssFile: fileURLToPath(
        new URL(pathWithoutExt + ".scss", import.meta.url),
      ),
      tsFile: fileURLToPath(new URL(pathWithoutExt + ".ts", import.meta.url)),
      vueFile: fileURLToPath(new URL(file, import.meta.url)),
    });

    return entries;
  }, []);

// 编译 `vue` 组件 `scss`
async function compileScss() {
  console.info("compiling scss");
  for (const entry of vueEntries) {
    // 使用sass解析成css
    const result = sass.compile(entry.scssFile, sassOptions);

    // 生成css文件的位置
    const cssPath = path.join(ES_LIB_PATH, entry.name + CSS_EXTENSION);
    // 创建目录
    fs.mkdirSync(path.dirname(cssPath), { recursive: true });
    const mapCssPath = cssPath + ".map";
    fs.writeFileSync(
      cssPath,
      blockBanner +
        result.css +
        (result.sourceMap
          ? `\n/*# sourceMappingURL=${path.basename(mapCssPath)} */`
          : ""),
    );
    // 生成css.map
    if (result.sourceMap)
      fs.writeFileSync(mapCssPath, result.sourceMap.toString());
  }
}

/**
 * 根据 {@link vueEntries} 在项目生成对应的 `vue` 组件：
 * `[根目录]->components->[组件名]->[组件名].vue`
 */
const buildVuePlugin: OutputPlugin = {
  name: "build-vue",
  async writeBundle() {
    for (const entry of vueEntries) {
      // 原始 `vue` 文件内容
      const originVue = fs.readFileSync(entry.vueFile, "utf-8");

      // vue中的 `ts` 代码编译后的 `js` 文件路径
      const jsPath = path.join(
        "../../",
        ES_LIB_PATH,
        entry.name + ES_EXTENSION,
      );
      /** 通过 {@link compileScss} 方法编译后的 `css` 文件 */
      const cssPath = path.join(
        "../../",
        ES_LIB_PATH,
        entry.name + CSS_EXTENSION,
      );
      // 创建目录
      fs.mkdirSync(path.dirname(entry.name), { recursive: true });
      // 创建 `[根目录]->components->[组件名]->[组件名].vue` 文件
      fs.writeFileSync(
        entry.name + ".vue",
        htmlBanner +
          originVue
            //替换 `<script>` 标签中的src
            .replace(/(<script.*src=")[^"]*("[^>]*>)/, `$1${jsPath}$2`)
            //删除 `<script>` 标签的 `lang` 属性
            .replace(/(<script.*)lang="[^"]*"\s([^>]*>)/, "$1$2")
            //替换 `<style>` 标签中的src
            .replace(/(<style.*src=")[^"]*("[^>]*>)/, `$1${cssPath}$2`)
            //删除 `<style>` 标签的 `lang` 属性
            .replace(/(<style.*)lang="[^"]*"\s([^>]*>)/, "$1$2"),
      );
    }
  },
};

async function optionsFun(): Promise<RollupOptions | RollupOptions[]> {
  // 只是针对es：编译scss文件
  await compileScss();

  return [
    {
      external: ["vue", "vuex", "@dcloudio/uni-app"],
      input: {
        ...indexEntries,
        // 仅编译 vue 的 ts
        ...Object.fromEntries(
          vueEntries.map((entry) => [entry.name, entry.tsFile]),
        ),
      },
      preserveEntrySignatures: "strict",
      strictDeprecations: true,
      output: {
        format: "es",
        dir: ES_LIB_PATH,
        entryFileNames: "[name]" + ES_EXTENSION,
        sourcemap: true,
        banner: blockBanner,
        plugins: [buildVuePlugin],
      },
      plugins: [
        nodeResolve(),
        typescript({
          useTsconfigDeclarationDir: true,
          exclude: ["rollup.config.ts"],
        }),
        commonjs(),
      ],
    },
    {
      external: ["vue", "vuex", "@dcloudio/uni-app"],
      input: {
        ...indexEntries,
        // 仅编译 vue 的 ts
        ...Object.fromEntries(
          vueEntries.map((entry) => [entry.name, entry.vueFile]),
        ),
      },
      preserveEntrySignatures: "strict",
      strictDeprecations: true,
      output: {
        format: "cjs",
        dir: CJS_LIB_PATH,
        entryFileNames: "[name]" + CJS_EXTENSION,
        sourcemap: true,
        banner: blockBanner,
        globals: {
          vue: "Vue",
        },
      },
      plugins: [
        vue({ css: false }),
        nodeResolve({ extensions: [".vue", ".ts"] }),
        typescript({
          exclude: ["rollup.config.ts"],
          tsconfigOverride: {
            compilerOptions: {
              declaration: false,
              composite: false,
            },
            exclude: ["rollup.config.ts"],
          },
        }),
        commonjs(),
        postcss(),
      ],
    },
  ];
}

/**
 * 定义 `rollup` 配置
 */
export default defineConfig(optionsFun);
