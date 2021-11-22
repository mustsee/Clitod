const fs = require("fs");
const ora = require("ora");
const clear = require("clear");
const chalk = require("chalk");
const isUrl = require("is-url");
const figlet = require("figlet");
const { google } = require("googleapis");
const minimist = require("minimist");
const puppeteer = require("puppeteer");

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

const getTargetFolder = async (auth) => {
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
    throw new Error(e);
  }
};

const takeScreenshot = async (auth, folder, url, name) => {
  if (!name || !isUrl(url))
    return console.log("Error in options : name or in URL");
  try {
    const spinner = ora("Taking a screenshot...").start();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: `${name}.jpeg`, fullPage: true });
    await browser.close();
    spinner.succeed("Successfully took a screenshot of " + name);
    spinner.start("Download to Google Drive");
    const drive = google.drive({ version: "v3", auth });
    var fileMetadata = {
      name: `${name}.jpeg`,
      parents: [`${folder.id}`],
    };
    var media = {
      mimeType: "image/jpeg",
      body: fs.createReadStream(`./${name}.jpeg`),
    };
    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id",
      },
      (e) => {
        if (e) {
          spinner.fail("Error... Please try again");
          throw new Error(e);
        }
        fs.unlinkSync(`./${name}.jpeg`);
        spinner.succeed("Successfully downloaded to Google Drive");
      }
    );
  } catch (e) {
    spinner.fail("Error... Please try again");
    throw new Error(e);
  }
};

module.exports = (async () => {
  try {
    // Get Google Drive instance
    const auth = await getGoogleDriveAuth();
    const folder = await getTargetFolder(auth);

    const string = ["url", "name"];
    const args = minimist(process.argv.slice(2), { string });

    if (args._.includes("folder")) {
      chooseTargetFolder(auth);
    } else if (args._.includes("screenshot")) {
      takeScreenshot(auth, folder, args.url, args.name);
    } else {
      console.log(
        "Please see usage section on the following github page : https://github.com/mustsee/clitod \n"
      );
    }
  } catch (e) {
    console.log("Error", e);
  }
})();
