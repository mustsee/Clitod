const configstore = require("configstore");
const pkg = require("../package.json");

module.exports = {
  log: (message) => {
    return console.log(message);
  },
  config: () => {
    return new configstore(pkg.name);
  },
  isConfigFinished: (config) => {
    return config.has("configFinished");
  },
};
