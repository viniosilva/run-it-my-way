const electron = require("electron");
const http = require("http");
const https = require("https");
const fs = require("fs");
const fsAsync = require("fs/promises");
const path = require("node:path");

const rootPath = electron.app.getAppPath();

const dataFolder = path.join(rootPath, "data");
const groupsFolder = path.join(dataFolder, "groups");
const appsFolder = path.join(dataFolder, "apps");

async function prepareFolders() {
  if (!(await exists(dataFolder))) {
    await fsAsync.mkdir(dataFolder);
  }
  if (!(await exists(groupsFolder))) {
    await fsAsync.mkdir(groupsFolder);
  }
  if (!(await exists(appsFolder))) {
    await fsAsync.mkdir(appsFolder);
  }
}

async function readGroups() {
  const contents = await fsAsync.readdir(groupsFolder);
  const groups = await Promise.all(
    contents.map(async (content) =>
      JSON.parse(
        await fsAsync.readFile(path.join(groupsFolder, content), "utf-8")
      )
    )
  );

  return groups.sort((a, b) => a.id - b.id);
}

async function readApps() {
  const dirs = await fsAsync.readdir(appsFolder);
  const apps = await Promise.all(
    dirs.map(async (dir2) => {
      const contents = await fsAsync.readdir(path.join(appsFolder, dir2));
      return await Promise.all(
        contents.map(async (content) =>
          JSON.parse(
            await fsAsync.readFile(
              path.join(appsFolder, dir2, content),
              "utf-8"
            )
          )
        )
      );
    })
  );

  return apps.flatMap((v) => v).sort((a, b) => a.id - b.id);
}

async function readSettings() {
  return JSON.parse(
    await fsAsync.readFile(path.join(dataFolder, "settings.json"), "utf-8")
  );
}

async function writeApp(app) {
  const name = normalizeString(app.name);
  const filePath = path.join(appsFolder, getLetterFolder(name), `${name}.json`);
  await fsAsync.writeFile(filePath, JSON.stringify(app, null, "  "));
}

function getRootPath() {
  return rootPath;
}

async function exists(path) {
  try {
    await fsAsync.access(path);
    return true;
  } catch (_) {
    return false;
  }
}

function getLinkFilename(link) {
  return link.split("/").pop();
}

function normalizeString(value) {
  return decodeURI(value).toLowerCase().replaceAll(" ", "_").replace("'", "'");
}

function getLetterFolder(value) {
  const letter = value.substr(0, 1).toLowerCase();

  return /[a-zA-Z]/.test(letter) ? letter : "#";
}

function download(link, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    fetch(link)
      .then((res) => res.blob())
      .then((blob) => blob.arrayBuffer())
      .then((buffer) => file.write(Buffer.from(buffer)))
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

function unzip(filePath, type) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    fetch(link)
      .then((res) => res.blob())
      .then((blob) => blob.arrayBuffer())
      .then((buffer) => file.write(Buffer.from(buffer)))
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

module.exports = {
  prepareFolders,
  readGroups,
  readApps,
  readSettings,
  writeApp,
  getRootPath,
  exists,
  getLinkFilename,
  normalizeString,
  getLetterFolder,
  download,
};
