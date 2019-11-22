'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, options) => {
  console.log(`Webpack4 'mode': ${options.mode}`);
  const devMode = (options.mode === 'development') ? true : false;

  let jsOutputName = devMode ? 'voplayer-ui.debug.js' : 'voplayer-ui.min.js';
  let cssOutputName = devMode ? 'voplayer-ui.debug.css' : 'voplayer-ui.min.css';

  let jsOutputDir;
  let cssOutputDir;
  if (options.tempPluginDir) {
    jsOutputDir = path.join(__dirname, './' + options.tempPluginDir + '/build');
    cssOutputDir = path.join(__dirname, './' + options.tempPluginDir + '/build');
  } else {
    jsOutputDir = path.join(__dirname, './tmpplugin/build');
    cssOutputDir = path.join(__dirname, './tmpplugin/build');
  }

  return {
    entry: path.join(__dirname, 'src/index.ts'),
    output: {
      path: jsOutputDir,
      filename: jsOutputName,
      // libraryTarget: 'umd',
      // globalObject: 'this',
      // libraryExport: 'default',
      //library: 'UIEngine'
    },
    resolve: {
      extensions: ['.js', '.ts']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.join(__dirname, 'src')
          ],
          use: {
            // use'babel-loader' to build js files. For options, see .babelrc
            loader: 'babel-loader'
          }
        }, {
          test: /\.tsx?$/,
          include: [
            path.join(__dirname, 'src')
          ],
          use: {
            // use 'awesome-typescript-loader' to build ts files.
            loader: 'awesome-typescript-loader'
          }
        }, {
          test: /\.(sa|sc|c)ss$/,
          include: [
            path.join(__dirname, 'src/ui')
          ],
          use: [{
            //loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader, // 'style-loader' creates style nodes from JS strings;
            loader: MiniCssExtractPlugin.loader
          }, {
            loader: 'css-loader', // translates CSS into CommonJS
            options: { minimize: devMode ? false : true }
          }, {
            loader: 'sass-loader' // compiles Sass to CSS
          }]
        }, {
          test: /\.(png|jpg|gif)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: './assets/img/[name].[ext]'
            }
          }]
        }, {
          test: /\.svg$/,
          use: {
            loader: 'svg-url-loader',
            options: {}
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        path: cssOutputDir,
        filename: cssOutputName,
        chunkFilename: '[id].css'
      })
    ]
  }
};
