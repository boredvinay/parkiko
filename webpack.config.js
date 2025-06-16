const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'appPackage/build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader','css-loader'] },
      { test: /\.(png|ico)$/, use: 'file-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/static/favicon.ico'
    })
  ],
  devServer: {
    historyApiFallback: true,
    port: 3000,
    proxy: [
      {
        context: ['/api'],                     // which requests to proxy
        target: 'http://localhost:3978',       // your backend
        secure: false,                         // if you’re using https on the backend
        changeOrigin: true,                    // rewrite the Host header to target URL
        pathRewrite: { '^/api': '/api' }       // optional, if you need to strip or remap paths
      }
    ]
  }
};
