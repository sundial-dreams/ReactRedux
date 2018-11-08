const common = require("./webpack.common.config");
const {resolve} = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");

module.exports = merge(common, {   //合并两个webpack文件
  devServer: {
    port: 9000,
    contentBase: resolve(__dirname, "public"), //找public下的index.html
    compress: true,
    hot: true,                     //模块热加载
    inline: true,
    open: 'Chrome',                //构建完成时自动打开浏览器
    openPage:""
  },
  devtool:"inline-source-map",      //方便调试，将src目录下的资源映射到浏览器中
  mode: "development",
  plugins:[
    new webpack.HotModuleReplacementPlugin(), //使用模块热加载插件
  ]
});