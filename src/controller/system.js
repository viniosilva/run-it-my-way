const { app } = require("electron/main");
const { vars } = require("../global");

function loadCollections() {
  vars.win.loadFile("src/view/collections/index.html");
}

function loadApps(e, collectionId) {
  vars.collectionId = collectionId;
  vars.win.loadFile("src/view/apps/index.html");
}

function exit() {
  app.quit();
}

module.exports = {
  loadCollections,
  loadApps,
  exit,
};
