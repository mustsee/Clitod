const { prompt } = require("inquirer");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

const { config, isConfigFinished, log } = require("./utils");

module.exports = {
  helpConfigure: async () => {
    /* if (isConfigFinished(config())) {
      return log("Google Drive access already initialized !");
    } */

    /*     async function ask(question) {
      const answer = await prompt(question);
      return answer[question.name];
    } */

    questions = [
      {
        name: "authMode",
        type: "list",
        message: "What is your authentification mode ?",
        choices: ["OAuth", "Service Account"],
      },
      {
        name: "credPath",
        message: "Where is located your credentials file (relative path) ?",
      },
      {
        name: "code",
        message: "Enter the code from that page here : ",
      },
    ];

    /*    const authMode = await ask(questions[0]);
    console.log("authMode", authMode); */

    const answer0 = await prompt(questions[0]);
    if (answer0.authMode === "Service Account") {
      return log("This option is not yet available.");
    }
    if (answer0.authMode === "OAuth") {
      const answer1 = await prompt(questions[1]);
      const credPath = path.resolve(path.dirname(__filename), answer1.credPath);
      try {
        fs.accessSync(credPath);
      } catch {
        // return to second question
        return log(
          "File not found. Check if path given is correct : " + credPath
        );
      }
      const file = fs.readFileSync(credPath);
      const credentials = JSON.parse(file);
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      if (!client_secret || !client_id || !redirect_uris) {
        return log("Credentials file is incomplete");
      }
      config().set("credentials", credentials);
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );
      if (config().has("token")) {
        oAuth2Client.setCredentials(JSON.parse(config().get("token")));
        return log("You're all set !");
      } else {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: "offline",
          scope: ["https://www.googleapis.com/auth/drive"],
        });
        console.log("Authorize this app by visiting this url:", authUrl);
        const answser2 = await prompt(questions[2]);
        const token = await oAuth2Client.getToken(answser2.code);
        config().set("token", token);
        oAuth2Client.setCredentials(token);
        config().set("configFinished", true);
        return log("You're all set !");
      }
    }
  },
};
