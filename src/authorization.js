const { prompt } = require("inquirer");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

const { config, isConfigFinished, log } = require("./utils");

module.exports = {
  helpConfigure: async () => {
    if (isConfigFinished(config())) {
      return log("Google Drive access already initialized !");
    }

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

    async function ask(question) {
      const answer = await prompt(question);
      return answer[question.name];
    }

    const authMode = await ask(questions[0]);
    if (authMode.includes("Service Account")) {
      return log("This option is not yet available.");
    }
    if (authMode.includes("OAuth")) {
      const relativePath = await ask(questions[1]);
      if (!relativePath) return log("Path is not defined");
      const fullPath = path.resolve(path.dirname(__filename), relativePath);
      try {
        fs.accessSync(fullPath);
      } catch {
        // return to second question
        return log(
          "File not found. Check if path given is correct : " + fullPath
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
