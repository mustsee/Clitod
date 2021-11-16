const path = require("path");
const fs = require("fs");

module.exports = {
  fileExists: (relativePath) => {
    try {
      fs.accessSync(path.resolve(path.dirname(__filename), relativePath));
      return true;
    } catch {
      return false;
    }
  },
  fullPath: (relativePath) => {
    return path.resolve(path.dirname(__filename), relativePath);
  },
  readFile: (path) => {
    const file = fs.readFileSync(path);
    return JSON.parse(file);
  },
};
