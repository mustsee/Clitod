const inquirer = require("inquirer");

const files = require("./files");

module.exports = {
  askPathCredentials: () => {
    return inquirer.prompt({
      name: "relativePath",
      type: "input",
      message: "Enter the location of your credentials:",
      validate: function (value) {
        if (value.length && files.fileExists(value)) {
          return true;
        } else {
          return "The path is incorrect: " + files.fullPath(value);
        }
      },
    });
  },
  getAuthenticationCode: () => {
    return inquirer.prompt({
      name: "code",
      type: "input",
      message: "Enter the code from the page here:",
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter the code from the page here:";
        }
      },
    });
  },
};
