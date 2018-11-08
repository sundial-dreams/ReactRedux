//webpack.config.js
const common = require("./webpack.common.config");
const merge = require("webpack-merge");
module.exports = merge(common, {
  devtool: "none",
  mode:"production"
});