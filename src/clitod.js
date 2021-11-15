const minimist = require("minimist");
const ora = require("ora");
const Configstore = require("configstore");

const { helpConfigure } = require("./authorization");
const { get } = require("lodash");

module.exports = {
  run(argv) {
    const args = minimist(argv);
    const firstCommand = args._[0];
    if (firstCommand === "check") {
      // Check if config file is present
      this.checkConfiguration();
    } else if (firstCommand === "configure") {
      helpConfigure();
    } else if (firstCommand === "folder") {
      this.chooseFolder();
    } else if (firstCommand === "screenshot") {
      this.screenshot(args._.slice(1));
    } else {
      this.showHelp();
    }
  },

  // Utils
  log: (message) => console.log(message),

  checkConfiguration: () => {
    const spinner = ora(
      "Checking if configuration file is present...\n"
    ).start();
    const conf = new Configstore(pkg.name);
    const isInitialized = conf.has("initialized");
    if (!isInitialized) {
      spinner.fail(
        "First configure the access to your Google Drive account before continuing"
      );
      spinner.stop();
    }
    const authMode = conf.has("authMode");
  },

  chooseFolder: () => {
    console.log("func chooseFolder");
  },
  screenshot: (args) => {
    console.log("func screenshot", args);
  },
  showHelp: () => {
    console.log("func showHelp");
  },
};
