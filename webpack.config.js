const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {

  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    filename: '[contenthash].bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: "/"
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    port: 4200
  },

  resolve: {
    alias: {
      lib: path.resolve(__dirname, 'src/lib')
    }
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/favicon', to: path.join(__dirname, 'public') },
      ],
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[contenthash].style.css'
    })
  ],

  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|gif)$/i,
        loader: 'file-loader',
        options: {outputPath: 'assets'},
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env'
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties'
          ]
        }
      }
    ],
  },
};
