const minimist = require("minimist");

const { helpConfigure } = require("./authorization");
const { chooseFolder } = require("./folder");
const { config, log } = require("./utils");

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
      chooseFolder();
    } else if (firstCommand === "screenshot") {
      this.screenshot(args._.slice(1));
    } else {
      this.showHelp();
    }
  },

  checkConfiguration: () => {
    if (!config().has("configFinished")) {
      return log(
        "First configure the access to your Google Drive account before continuing"
      );
    }
    return log("You're all set !");
  },

  screenshot: (args) => {
    console.log("func screenshot", args);
  },
  showHelp: () => {
    console.log("func showHelp");
  },
};
