const path = require('path');

module.exports = {
    entry: './public/javascripts/location-info.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/dist'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    mode: 'development'
}