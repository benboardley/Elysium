module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: ['react-native-reanimated/plugin'],
}


const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const appDirectory = path.resolve(__dirname)
const { presets } = require(`${appDirectory}/babel.config.js`)

const compileNodeModules = [
    // Add every react-native package that needs compiling
    '@gorhom/bottom-sheet',
    'react-native',
].map((moduleName) => path.resolve(appDirectory, `node_modules/${moduleName}`))

const babelLoaderConfiguration = {
    test: /\.js$|tsx?$/,
    // Add every directory that needs to be compiled by Babel during the build.
    include: [
        path.resolve(__dirname, 'index.web.js'), // Entry to your application
        path.resolve(__dirname, './App.tsx'), // Change this to your main App file
        path.resolve(__dirname, 'src'),
        ...compileNodeModules,
    ],
    use: {
        loader: 'babel-loader',
        options: {
            cacheDirectory: false,
            presets,
            plugins: ['react-native-web', 'react-native-reanimated/plugin'],
        },
    },
}

const svgLoaderConfiguration = {
    test: /\.svg$/,
    use: [
        {
            loader: '@svgr/webpack',
        },
    ],
}

const imageLoaderConfiguration = {
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
        loader: 'url-loader',
        options: {
            name: '[name].[ext]',
            esModule: false,
        },
    },
}

module.exports = {
    entry: {
        app: path.join(__dirname, 'index.web.js'),
    },
    output: {
        path: path.resolve(appDirectory, 'dist'),
        publicPath: '/',
        filename: 'main.bundle.js',
    },
    resolve: {
        extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
        alias: {
            'react-native$': 'react-native-web',
            screens: path.resolve(__dirname, 'src/screens'),
            components: path.resolve(__dirname, 'src/components')
        },
    },
    module: {
        rules: [
            babelLoaderConfiguration,
            imageLoaderConfiguration,
            svgLoaderConfiguration,
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            {
                test: /\.ttf$/,
                loader: 'url-loader', // or directly file-loader
                include: path.resolve(
                    __dirname,
                    'node_modules/react-native-vector-icons',
                ),
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html'),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            // See: https://github.com/necolas/react-native-web/issues/349
            __DEV__: JSON.stringify(true),
        }),
        new webpack.DefinePlugin({ process: { env: {} } }),
    ],
    devServer: {
        allowedHosts: "all",
        historyApiFallback: true,
    },
}
