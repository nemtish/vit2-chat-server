const webpack = require('webpack');

module.exports = {
    pages: {
        index: {
            entry: 'src/main.js',
            // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Vitamin2 Chat Dashboard',
        },
    },
    configureWebpack: {
        plugins: [
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1,
            }),
        ],
    },
    chainWebpack:
    (config) => {
        config.optimization.delete('splitChunks');
    },
    filenameHashing: false,
    css: {
        loaderOptions: {
            scss: {
                additionalData: `
                    @import "@/scss/global/index.scss";
                `,
            },
        },
    },
};
