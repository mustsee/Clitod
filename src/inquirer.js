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
  display: ({ files, nextPageToken }) => {
    let choices = files.map(({ id, name }) => {
      return {
        name: name,
        value: { id, name },
      };
    });
    if (nextPageToken) {
      choices.push(new inquirer.Separator());
      choices.push({ name: "Next page", value: { nextPage: nextPageToken } });
      choices.push(new inquirer.Separator());
    }
    return inquirer.prompt({
      name: "display",
      type: "list",
      message: "Select folder",
      choices,
    });
  },
  select: ({ id, name }) => {
    return inquirer.prompt({
      name: "select",
      type: "list",
      message: "Select target folder",
      choices: [
        { name, value: { id, name } },
        { name: "Go inside folder", value: { children: true, id, name } },
      ],
    });
  },
};
