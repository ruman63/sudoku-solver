module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ? '/sudoku-solver/' : '/',
    css: {
        loaderOptions: {
            css: {
            // options here will be passed to css-loader
            },
        }
    }
  }