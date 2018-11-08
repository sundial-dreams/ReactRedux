//webpack.common.config.js
const {resolve, join} = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const paths = {
  src: resolve(__dirname, "src"),
  dist: resolve(__dirname, "dist"),
  public: resolve(__dirname, "public")
};

const env = process.argv.pop();//获取当前的环境，生产或开发

const ENV = {
  pro: "production",
  dev: "development"
};

const isDev = env === ENV.dev;

module.exports = {
  entry: [
    join(paths.public, "index.html"),
    "@babel/polyfill",
    join(paths.src, "index.jsx"),
  ],
  output: {
    path: paths.dist,
    chunkFilename: isDev ? "[name].[hash].js" : "[name].js",
    filename: isDev ? "[name].[hash].js" : "[name].js",
  },
  module: {
    rules: [
      {
        //处理jsx,js
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        include: resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: isDev,
            sourceMap: isDev
          }
        }
      },
      {
        ///处理html
        test: /\.html?/,
        exclude: /node_modules/,
        include: resolve(__dirname, "public"),
        use: {
          loader: "html-loader",
          options: {
            minimize: isDev,  //压缩html代码
            sourceMap: isDev  //生产环境可以不用资源映射
          }
        }
      },
      {
        //处理css/scss/sass
        test: /\.(css|scss|sass)$/,
        exclude: /node_modules/,
        include: resolve(__dirname, "src"),
        loaders: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: isDev,  //资源映射
              modules: true,    //是否允许模块
              importLoaders: 20,
              localIdentName: isDev ? "[path][name]__[local]--[hash:base64:5]" : ""
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDev //生产环境没必要使用sourceMap了
            }
          },
          {
            loader: "postcss-loader",
            options:{
              sourceMap:isDev
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(paths.public, "index.html"),
      filename: "index.html",
      title: "react"
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? "[name].[hash].css" : "[name].css",
      chunkFilename: isDev ? "[id].[hash].css" : "[id].css"
    })
  ]
};
