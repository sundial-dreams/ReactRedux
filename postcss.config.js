const flexbugsFixes = require("postcss-flexbugs-fixes");
const presetEnv = require("postcss-preset-env");
module.exports = {
  plugins: [
    flexbugsFixes,
    presetEnv({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    })
  ]
};