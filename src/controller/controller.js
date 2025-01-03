const { run, getApps, getAppById, importApp } = require("./apps");
const { getCollection, getGroup } = require("./groups");
const { exit, loadCollections, loadApps } = require("./system");

function register(ipcMain) {
  ipcMain.handle("system:load-collections", loadCollections);
  ipcMain.handle("system:load-apps", loadApps);
  ipcMain.handle("system:exit", exit);

  ipcMain.handle("group:get", getGroup);
  ipcMain.handle("group:get-collection", getCollection);

  ipcMain.handle("apps:get", getApps);
  ipcMain.handle("apps:get-by-id", getAppById);
  ipcMain.handle("apps:run", run);
  ipcMain.handle("apps:import", importApp);
}

module.exports = {
  register,
};
