const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const { vars } = require("./global");
const {
  prepareFolders,
  readGroups,
  readApps,
  readSettings,
} = require("./infra/file-system");
const { register } = require("./controller/controller");

async function createWindow() {
  const win = new BrowserWindow({
    width: 0,
    height: 0,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  win.loadFile("src/view/collections/index.html");
  win.once("ready-to-show", () => {
    win.setFullScreen(true);
    // win.webContents.openDevTools();
  });

  await prepareFolders();

  vars.groups = await readGroups();
  vars.groupId = vars.groups[0].id;
  vars.apps = await readApps();
  vars.settings = await readSettings();
  vars.win = win;
}

app.on("ready", () => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

register(ipcMain);
