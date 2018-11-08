//webpack.common.config.js
const {resolve, join} = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const UglifyjsPlugin = require("uglifyjs-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const SafeParser = require("postcss-safe-parser");
const os = require("os");

const paths = {
  src: resolve(__dirname, "src"),
  dist: resolve(__dirname, "dist"),
  public: resolve(__dirname, "public")
};

const devPaths = {
  components: resolve(paths.src,"components"),
  pages: resolve(paths.src,"pages"),
  reduxs: resolve(paths.src,"reduxs"),
  router: resolve(paths.src,"router")
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
    require.resolve("@babel/polyfill"),
    join(paths.src, "index.jsx"),
  ],
  output: {
    path: paths.dist,
    chunkFilename: isDev ? "[name].[hash].chunk.js" : "[name].chunk.js",
    filename: isDev ? "[name].[hash].js" : "[name].js",
  },
  module: {
    rules: [
      {
        //处理jsx,js
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        include: paths.src,
        loaders: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              cacheDirectory: false,
              sourceMap: isDev
            }
          },
          {//处理jsx里面的css
            loader: require.resolve("astroturf/loader"),
            options: {extension: ".scss"},
          }
        ]
      },
      {
        ///处理html
        test: /\.html?/,
        exclude: /node_modules/,
        include: paths.public,
        use: {
          loader: require.resolve("html-loader"),
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
        include: paths.src,
        loaders: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve("css-loader"),
            options: {
              sourceMap: isDev,  //资源映射
              modules: true,    //是否允许模块
              importLoaders: 20,
              localIdentName: isDev ? "[path][name]__[local]__[hash:base64:5]" : ""
            }
          },
          {
            loader: require.resolve("sass-loader"),
            options: {
              sourceMap: isDev //生产环境没必要使用sourceMap了
            }
          },
          {//使用postcss
            loader: require.resolve("postcss-loader"),
            options: {
              sourceMap: isDev
            }
          },
        ]
      },
      {//处理图片文件
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        exclude: /node_modules/,
        include: paths.src,
        loader: require.resolve("url-loader"),
        options: {
          limit: 8192,//图片在这个范围内，会将图片变成base64减少http请求
          fallback: require.resolve("responsive-loader") //回退的loader
        }
      }
    ]
  },
  resolve: {
    extensions: ["*",".jsx",".js"],
    alias:devPaths
  },
  //优化

  optimization: {
    minimize: !isDev,//是否压缩
    minimizer: [
     // 优化css
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          parser: SafeParser,
          map: {inline: false, annotation: true},
        }
      }),

      new TerserPlugin({
        test:/\.jsx?/,
        include:paths.src,
        exclude:/node_modules/,
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warning: false,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comment: false,
            ascii_only: true
          },
          parallel: os.cpus().length,
          cache: true,
          sourceMap: isDev
        }
      })
    ],
    namedModules: true,
    namedChunks: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    moduleIds: "hashed",
    splitChunks: {
      chunks: "async",
      name: true,
      cacheGroups: {
       vendor: {
         test:/[\\/]node_modules[\\/]/,
         name: "vendors",
         chunks:"all"
       }
      }
    },
    runtimeChunk: true
  },

  //插件项
  plugins: [
    new HtmlWebpackPlugin({
      template: join(paths.public, "index.html"),
      filename: "index.html",
      inject: true,
      minify: isDev ? false : {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? "[name].[hash].css" : "[name].css",
      chunkFilename: isDev ? "[id].[hash].chunk.css" : "[id].chunk.css"
    }),
    //资源映射
    new webpack.SourceMapDevToolPlugin({
      filename: "[name].js.map",
      exclude: ['vendor.js']
    }),
    //js压缩插件
    new UglifyjsPlugin({
      test: /\.jsx?/,
      include: paths.src,
      exclude: /node_modules/,
      cache: true,
      parallel: os.cpus().length,
      sourceMap: true,
      uglifyOptions: {
        ie8: true,
      }
    }),
  ]
};
