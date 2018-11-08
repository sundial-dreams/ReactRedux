//postcss.config.js
const flexbugsFixes = require("postcss-flexbugs-fixes");
const presetEnv = require("postcss-preset-env");
const autoprefixer = require("autoprefixer");
const precss = require("precss");
const nested = require("postcss-nested");
//根据文件扩展名来选择语法
const syntax = require("postcss-syntax")({
  sass: require("postcss-sass"),
  css: "postcss-safe-parser",
  scss: "postcss-scss"
});
module.exports = {
  syntax: syntax,
  //插件
  plugins: [
    flexbugsFixes,
    presetEnv({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
    autoprefixer({grid: true}),
    precss,
    nested,
  ]
};