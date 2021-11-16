const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");

const googleDrive = require("./googleDrive");

clear();

console.log(chalk.blue(figlet.textSync("Clitod", { font: "Lean" })));

const getGoogleDriveToken = async () => {
  // Fetch token from config store
  let token = googleDrive.getStoredGoogleDriveToken();
  if (token) {
    return token;
  }

  // No token found, use credentials to access Google Drive account
  token = await googleDrive.getPersonnalAccessToken();

  return token;
};

module.exports = (async () => {
  try {
    // Retrieve & Set Authentication Token
    const token = await getGoogleDriveToken();
    googleDrive.googleDriveAuth(token);

    // handle commands
    // folder
    // screenshot
  } catch (e) {
    console.log("Error", e);
  }
})();
