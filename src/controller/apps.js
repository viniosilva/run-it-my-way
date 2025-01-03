const { exec } = require("child_process");
const fs = require("fs/promises");
const path = require("node:path");
const { vars } = require("../global");
const {
  getLinkFilename,
  normalizeString,
  getLetterFolder,
  getRootPath,
  download,
  writeApp,
  exists,
} = require("../infra/file-system");

function getApps() {
  return vars.apps.filter(({ collections }) =>
    collections.includes(vars.collectionId)
  );
}

function getAppById(e, id) {
  return vars.apps.find((app) => app.id === id);
}

function run(e, appId) {
  const app = vars.apps.find(({ id }) => id === appId);
  try {
    exec(encodeCommand(app.cmd));
  } catch (err) {
    throw err;
  }
}

function encodeCommand(value) {
  return value
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    .replaceAll("'", "\\'");
}

async function importApp(e, appId, link) {
  try {
    const linkFilename = normalizeString(getLinkFilename(link));
    const letterPath = path.join(
      getRootPath(),
      "data/files",
      getLetterFolder(linkFilename)
    );
    const filePath = path.join(letterPath, linkFilename);

    const app = vars.apps.find(({ id }) => id === appId);
    const settings = getAppSettingsByCollection(app);
    if (!settings) return;

    if (!(await exists(filePath))) {
      await fs.mkdir(letterPath, { recursive: true });
      await download(link, filePath);
      if (settings.unzip) {
        await unzip(filePath, setting.unzip)
      }
    }

    app.cmd = `${settings.cmd} ${filePath}`;
    await writeApp(app);
  } catch (err) {
    console.error(err);
  }
}

function getAppSettingsByCollection(app) {
  for (const c of app.collections) {
    const cmd = vars.settings.collections[c];
    if (cmd) return cmd;
  }
  return null;
}

module.exports = {
  getApps,
  getAppById,
  run,
  importApp,
};
