const { google } = require("googleapis");

module.exports = {
  get: async (auth, folderId, pageToken) => {
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
