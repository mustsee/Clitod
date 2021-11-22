const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const minimist = require("minimist");

const googleDrive = require("./googleDrive");
const inquirer = require("./inquirer");
const folder = require("./folder");

// TODO: Externalize this piece of code
const Configstore = require("configstore");
const pkg = require("../package.json");
const conf = new Configstore(pkg.name);

clear();

console.log(chalk.blue(figlet.textSync("Clitod", { font: "Lean" })));

// To delete data in configstore
// googleDrive.deleteStoredData()

const getGoogleDriveAuth = async () => {
  let credentials = googleDrive.getStoredCredentials();
  let token = googleDrive.getStoredToken();

  if (credentials && token) {
    return await googleDrive.getGoogleDriveAuth(credentials, token);
  }

  await googleDrive.getPersonnalAccessToken();

  credentials = googleDrive.getStoredCredentials();
  token = googleDrive.getStoredToken();

  return await googleDrive.getGoogleDriveAuth(credentials, token);
};

const getTargetFolder = async () => {
  let target = folder.getStoredTargetFolder();

  if (target) {
    console.log(`Your current target folder name is : ${target.name} \n`);
    return target;
  }

  return await chooseTargetFolder(auth);
};

const chooseTargetFolder = async (
  auth,
  folderId = "root",
  pageToken = null
) => {
  try {
    let { files, nextPageToken } = await folder.list(auth, folderId, pageToken);
    if (files.length) {
      const { display } = await inquirer.display({
        files,
        nextPageToken,
      });
      if (display.nextPage) {
        chooseTargetFolder(auth, folderId, display.nextPage);
      } else {
        const { select } = await inquirer.select(display);
        if (select.children) {
          chooseTargetFolder(auth, select.id, null);
        } else {
          conf.set("googleDrive.folder", { id: select.id, name: select.name });
          console.log(
            `\nSuccessfully set ${select.name} has the target folder !\n`
          );
          return { id: select.id, name: select.name };
        }
      }
    } else {
      console.log("No folders found.");
    }
  } catch (e) {
    console.log("Error : ", e);
  }
};

module.exports = (async () => {
  try {
    // Get Google Drive instance
    const auth = await getGoogleDriveAuth();
    const folder = await getTargetFolder(auth);

    const args = minimist(process.argv.slice(2));

    if (args._.includes("folder")) {
      chooseTargetFolder(auth);
    } else if (args._.includes("screenshot")) {
      // screenshot
    } else {
      console.log("Help");
      // Command not found
      // Show help
    }
  } catch (e) {
    console.log("Error", e);
  }
})();
