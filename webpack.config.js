const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  entry: {
    background: path.resolve(__dirname, 'src/background/index.ts'),
    duckduckgo: path.resolve(__dirname, 'src/inject/duckduckgo.ts'),
    settingsPage: path.resolve(__dirname, 'src/ui/settings.ts'),
    updatePage: path.resolve(__dirname, 'src/ui/update.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'extension/dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loaders: [ 'html-loader' ]
      },
      {
        test: /\.css$/,
        use: [
          'file-loader',
          'extract-loader',
          'css-loader'
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  optimization: {
    usedExports: true,
    sideEffects: false
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/ui/settings.html'),
      filename: './settings.html',
      inject: true,
      chunks: [ 'settingsPage' ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/ui/update.html'),
      filename: './update.html',
      inject: true,
      chunks: [ 'updatePage' ],
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
  ],
}
