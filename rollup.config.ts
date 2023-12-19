import { RollupOptions, defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import * as sass from "sass";
import { glob } from "glob";
import fs from "fs";

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
// es文件扩展名
const ES_EXTENSION = ".mjs";

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

/** 修改 `vue` 文件中 `<script>` 块的内容 */
function changeVueScript(vueContent: string, entry: VueEntry): string {
  // vue中的 `ts` 代码编译后的 `js` 文件路径
  const jsPath = path.join("../../", ES_LIB_PATH, entry.name + ES_EXTENSION);

  return (
    vueContent
      //替换 `<script>` 标签中的src
      .replace(/(<script.*?src=").*?(".*?>)/gm, `$1${jsPath}$2`)
      //删除 `<script>` 标签的 `lang` 属性
      .replace(/(<script.*?)lang=".*?"(.*?>)/gm, "$1$2")
  );
}

/** 编译 `vue` 文件中 `<style>` 块中的scss，并替换（仅支持单个<style>块） */
function compileVueScss(vueContent: string) {
  // 获取 `<style>` 中的 `scss`
  const scss = vueContent.replace(/.*?<style.*?>(.*)<\/style>.*/s, "$1");
  // 使用 `sass` 把 `scss` 解析成 `css`
  const css = sass.compileString(scss, {
    importers: [
      {
        findFileUrl(url: string): URL {
          return url.startsWith("@")
            ? new URL(path.join("src", url.substring(1)), import.meta.url)
            : new URL(url, import.meta.url);
        },
      },
    ],
  });
  // 替换 `<style>` 块中的内容，并把 `lang="scss"` 去掉
  return vueContent.replace(
    /(<style.*?)\slang=".*?"(.*?>).*(<\/style>)/s,
    `$1$2\n${css.css}\n$3`,
  );
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
      let vueContent = fs.readFileSync(entry.vueFile, "utf-8");

      // 修改 `<script>` 块的内容
      vueContent = changeVueScript(vueContent, entry);

      // 编译 `vue` 文件中 `<style>` 块中的scss，并替换
      vueContent = compileVueScss(vueContent);

      // 创建目录
      fs.mkdirSync(path.dirname(entry.name), { recursive: true });
      // 创建 `[根目录]->components->[组件名]->[组件名].vue` 文件
      fs.writeFileSync(entry.name + ".vue", htmlBanner + vueContent);
    }
  },
};

async function optionsFun(): Promise<RollupOptions | RollupOptions[]> {
  return {
    external: ["vue", "vuex", "@dcloudio/uni-app", "vue-property-decorator"],
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
  };
}

/**
 * 定义 `rollup` 配置
 */
export default defineConfig(optionsFun);
