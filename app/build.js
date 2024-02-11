const {build} = require("esbuild");
const glob = require("glob");
const entryPoints = glob.sync("./src/**/*.ts");
const fs = require("fs-extra");

const cmdList = process.argv.slice(2); // コマンドリスト

const isProd = cmdList.includes("pro");

console.log(`This build is ${isProd ? "production" : "development"} mode.`);

/* distフォルダ自体を削除 */
fs.remove("./dist").then(() => {
  build({
    define: {"process.env.NODE_ENV": process.env.NODE_ENV},
    entryPoints,
    outbase: "./src",
    outdir: "./dist", // 出力先ディレクトリ
    platform: "node",
    external: [], // バンドルに含めたくないライブラリがある場合は、パッケージ名を文字列で列挙する,
    watch: false, // trueにすれば、ファイルを監視して自動で再ビルドしてくれるようになる
    format: "cjs", // commonjs
    sourcemap: isProd ? false : "linked", // 開発環境ならソースマップを出力
    minify: isProd ? true : false, // 本番環境なら圧縮
  });
});
