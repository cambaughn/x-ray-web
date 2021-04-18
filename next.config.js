module.exports = {
  webpack: (config) => {
    config.node = {
      fs: 'empty'
    }
    return config
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  }
};
