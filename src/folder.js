const ConfigStore = require("configstore");
const { google } = require("googleapis");

const pkg = require("../package.json");

const conf = new ConfigStore(pkg.name);

module.exports = {
  getStoredTargetFolder: () => {
    return conf.get("googleDrive.folder");
  },
  list: async (auth, folderId, pageToken) => {
    const drive = google.drive({ version: "v3", auth });
    try {
      const res = await drive.files.list({
        pageSize: 10,
        q: `'${folderId}' in parents AND mimeType='application/vnd.google-apps.folder'`,
        fields: "nextPageToken, files(id, name, parents, mimeType)",
        orderBy: "name",
        pageToken,
      });
      const { files, nextPageToken } = res.data;
      return { files, nextPageToken };
    } catch (e) {
      return null;
    }
  },
};
