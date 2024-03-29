const path = require('path');

module.exports = {
  mode: 'development',
  entry: './public/javascripts/clusterMap.js',
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: 'bundle.js',
  },
};
