# Clitod

Clitod is a Node.js CLI that helps you connect via a OAuth2 and upload files into your google drive account.

## Description

Two steps are required to get started :

- Allow access to google drive
- Select folder in which you want to upload a file

Then you can updload a file :

- As for now, it is only possible to take a screenshot from an URL

## Quickstart

1. Clone the repository
2. Then you need to obtain OAuth 2.0 credentials from the Google API Console, visit : https://console.cloud.google.com/apis/credentials

- Click "+ CREATE CREDENTIALS" and select "Oauth Client ID" option
- Select an application type, no need to set up authorized domains / callback URIs
- Download the json file created and put it inside the cloned repository.

3. Assuming we are inside the clitod repository, type `node bin/clitod.js` and follow the instructions

- First you will connect to your Google Drive account
- Then you will choose a target folder

4. Finally, you can take a screenshot, it will automatically put it in the chosen folder : see example in usage section.

## Usage

Assuming we are inside the clitod repository

```bash

node bin/clitod.js <command>

Commands:
  node bin/clitod.js folder                                      Choose a target folder
  node bin/clitod.js screenshot --name <name> --url <url>        Take a screenshot and send it

Example:
  node bin/clitod.js screenshot --name myHomePage --url https://github.com/mustsee/clitod

```

## Contributing

Pull requests are welcome.

## License

Unlicensed

## Documentation

CJS :

- https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/
  - https://github.com/sitepoint-editors/ginit : minimist, inquirer

ESM :

- https://www.twilio.com/blog/how-to-build-a-cli-with-node-js
