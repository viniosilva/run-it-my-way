const electron = require("electron");
const fs = require("fs");
const path = require("node:path");
const zip = new require("jszip");

const rootPath = electron.app.getAppPath();

const dataFolder = path.join(rootPath, "data");
const groupsFolder = path.join(dataFolder, "groups");
const appsFolder = path.join(dataFolder, "apps");

function getRootPath() {
  return rootPath;
}

async function prepareFolders() {
  await Promise.all([
    fs.promises.mkdir(dataFolder, { recursive: true }),
    fs.promises.mkdir(groupsFolder, { recursive: true }),
    fs.promises.mkdir(appsFolder, { recursive: true }),
  ]);
}

async function readGroups() {
  const contents = await fs.promises.readdir(groupsFolder);
  const groups = [];

  for (const content of contents) {
    const file = await fs.promises.readFile(
      path.join(groupsFolder, content),
      "utf-8"
    );

    const groupObj = JSON.parse(file);
    groups.push(groupObj);
  }

  return groups.sort((a, b) => a.id - b.id);
}

async function readApps() {
  const dirs = await fs.promises.readdir(appsFolder);
  const apps = [];

  for (const dir of dirs) {
    const contents = await fs.promises.readdir(path.join(appsFolder, dir));

    for (const content of contents) {
      const file = await fs.promises.readFile(
        path.join(appsFolder, dir, content),
        "utf-8"
      );

      const appObj = JSON.parse(file);
      apps.push(appObj);
    }
  }

  return apps.flatMap((v) => v).sort((a, b) => a.id - b.id);
}

async function readSettings() {
  const file = await fs.promises.readFile(
    path.join(dataFolder, "settings.json"),
    "utf-8"
  );

  return JSON.parse(file);
}

async function writeApp(app) {
  const name = normalizeString(app.name);
  const letter = getLetterFolder(name);
  const filePath = path.join(appsFolder, letter, `${name}.json`);

  await fs.promises.writeFile(filePath, JSON.stringify(app, null, "  "));
}

async function exists(pathfile, opts) {
  const dir = pathfile.split("/").slice(0, -1).join("/");

  let filename = pathfile.split("/").pop();
  if (opts.withoutExt) {
    filename = filename.split(".").slice(0, -1).join(".") + ".";
  }

  let found = false;
  const contents = await fs.promises.readdir(dir);
  for (const content of contents) {
    const curFilename = content.split("/").pop();

    if (curFilename.startsWith(filename)) {
      found = true;
      break;
    }
  }

  return found;
}

function normalizeString(value) {
  return decodeURI(value)
    .toLowerCase()
    .replaceAll(" ", "_")
    .replace("'", "\\'");
}

function getLetterFolder(value) {
  const letter = value.substr(0, 1).toLowerCase();

  return /[a-zA-Z]/.test(letter) ? letter : "#";
}

async function download(link, filePath) {
  const file = fs.createWriteStream(filePath);

  const res = await fetch(link);
  const blob = await res.blob();
  const buffer = await blob.arrayBuffer();

  file.write(Buffer.from(buffer));
}

async function unzip(filePath) {
  const data = await fs.promises.readFile(filePath);

  const { files } = await zip.loadAsync(data);
  const file = Object.values(files).shift();
  const buffer = await file.async("nodebuffer");

  const dir = filePath.split("/").slice(0, -1).join("/");
  const filename = normalizeString(file.name);
  const unzipFilePath = path.join(dir, filename);

  await fs.promises.writeFile(unzipFilePath, buffer);

  return unzipFilePath;
}

module.exports = {
  prepareFolders,
  readGroups,
  readApps,
  readSettings,
  writeApp,
  getRootPath,
  exists,
  normalizeString,
  getLetterFolder,
  download,
  unzip,
};
