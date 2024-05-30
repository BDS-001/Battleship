const path = require('path');

module.exports = {
  entry: './src/engine.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};