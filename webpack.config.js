const path = require('path');

module.exports = {
  entry: './src/ui.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};