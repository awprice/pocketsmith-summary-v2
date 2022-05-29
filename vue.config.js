const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/.netlify': {
        target: 'http://localhost:9000',
        pathRewrite: { '^/.netlify/functions': '' },
      },
    },
  }
})
