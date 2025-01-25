const { exec } = require("child_process");
const fs = require("fs");
const path = require("node:path");
const { vars } = require("../global");
const {
  normalizeString,
  getLetterFolder,
  getRootPath,
  download,
  writeApp,
  exists,
  unzip,
} = require("../infra/file-system");

function getApps() {
  return vars.apps.filter(({ collections }) =>
    collections.includes(vars.collectionId)
  );
}

function getAppById(_, id) {
  return vars.apps.find((app) => app.id === id);
}

function run(_, appId) {
  const app = vars.apps.find(({ id }) => id === appId);
  if (!app.cmd) return;

  exec(encodeCommand(app.cmd));
}

function encodeCommand(value) {
  return value
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    .replaceAll("'", "\\'");
}

async function importApp(_, appId, link) {
  try {
    const linkFilename = link.split("/").pop();
    const filename = normalizeString(linkFilename);
    const letter = getLetterFolder(filename);
    const letterPath = path.join(getRootPath(), "data/files", letter);
    let filePath = path.join(letterPath, filename);

    const app = vars.apps.find(({ id }) => id === appId);
    const settings = getAppSettingsByCollection(app);
    if (!settings) return;

    await fs.promises.mkdir(letterPath, { recursive: true });
    if (!(await exists(filePath, { withoutExt: true }))) {
      await download(link, filePath);

      if (settings.unzip_ext) {
        const zipFile = await unzip(filePath, settings.unzip_ext);
        await fs.promises.rm(filePath);
        filePath = zipFile;
      }
    }

    app.cmd = `${settings.cmd} ${filePath}`;
    await writeApp(app);
  } catch (err) {
    console.error(err);
  }
}

function getAppSettingsByCollection(app) {
  for (const tag of app.tags) {
    const cmd = vars.settings.collections[tag];
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
