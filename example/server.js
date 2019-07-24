const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config')

const app = express()
const compiler = webpack(webpackConfig)

app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
}))
app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

// 为什么此处要用导出呀？
module.exports = app.listen(3000, () => {
  console.log('http://localhost:3000')
})
