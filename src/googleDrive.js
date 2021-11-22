const Configstore = require("configstore");
const { google } = require("googleapis");

const files = require("./files");
const inquirer = require("./inquirer");
const pkg = require("../package.json");

const conf = new Configstore(pkg.name);

const SCOPES = ["https://www.googleapis.com/auth/drive"];

module.exports = {
  getStoredToken: () => {
    return conf.get("googleDrive.token");
  },
  getStoredCredentials: () => {
    return conf.get("googleDrive.credentials");
  },
  deleteStoredData: () => {
    return conf.clear();
  },
  getGoogleDriveAuth: async (credentials, token) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    const auth = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    auth.setCredentials(token);

    return auth;
  },
  getPersonnalAccessToken: async () => {
    const pathToFile = await inquirer.askPathCredentials();
    const credentials = files.readFile(files.fullPath(pathToFile.relativePath));
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    const oAuth2Client = await new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    conf.set("googleDrive.credentials", credentials);

    const authUrl = await oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });

    console.log("\nAuthorize this app by visiting the url:\n" + authUrl + "\n");
    const authorize = await inquirer.getAuthenticationCode();

    const token = await oAuth2Client.getToken(authorize.code);
    if (token) {
      conf.set("googleDrive.token", token.res.data);
      return;
    } else {
      throw new Error("Google Drive token was not found in the response");
    }
  },
};
