const { contextBridge, ipcRenderer } = require("electron/renderer");
const { vars } = require("./global");

contextBridge.exposeInMainWorld("app", {
  /* SYSTEM */
  exit: () => ipcRenderer.invoke("system:exit"),

  /* VIEWS */
  loadCollections: () => ipcRenderer.invoke("system:load-collections"),
  loadApps: (collectionId) =>
    ipcRenderer.invoke("system:load-apps", collectionId),

  /* GROUPS */
  getGroup: () => ipcRenderer.invoke("group:get"),
  getCollection: () => ipcRenderer.invoke("group:get-collection"),

  /* APPS */
  getApps: () =>
    ipcRenderer.invoke("apps:get"),
  runApp: (appId) => ipcRenderer.invoke("apps:run", appId),
  getAppById: (appId) => ipcRenderer.invoke("apps:get-by-id", appId),
  importApp: (appId, link) =>
    ipcRenderer.invoke("apps:import", appId, link),
});
