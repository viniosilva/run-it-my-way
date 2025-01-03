class AppScreen {
  tabindex = "1";
  mapCommandsUp = {
    [COMMAND.MENU]: () => this.menuContainer.activate(),
    [COMMAND.OPTIONS]: () => this.optionsContainer.buildComponent(),
    [COMMAND.SELECT]: () => {
      document.querySelector("#apps > ul li:focus")?.click();
    },
    [COMMAND.BACK]: () => {
      window.app.loadCollections();
    },
  };

  mapCommandsDown = {
    [COMMAND.UP]: () => {
      const item = focusItem(
        Array.from(document.querySelectorAll("#apps > ul li")),
        -1,
        true
      );
      this.tabindex = item.getAttribute("tabindex");
    },
    [COMMAND.DOWN]: () => {
      const item = focusItem(
        Array.from(document.querySelectorAll("#apps > ul li")),
        1,
        true
      );
      this.tabindex = item.getAttribute("tabindex");
    },
    [COMMAND.LEFT]: () => {
      const item = focusItem(
        Array.from(document.querySelectorAll("#apps > ul li")),
        -10,
        true
      );
      this.tabindex = item.getAttribute("tabindex");
    },
    [COMMAND.RIGHT]: () => {
      const item = focusItem(
        Array.from(document.querySelectorAll("#apps > ul li")),
        10,
        true
      );
      this.tabindex = item.getAttribute("tabindex");
    },
  };

  constructor(menuContainer, optionsContainer) {
    this.menuContainer = menuContainer;
    this.optionsContainer = optionsContainer;
  }

  async buildScreen() {
    const collection = await window.app.getCollection();
    const apps = await window.app.getApps();
    document.getElementById("title").textContent = collection.name;

    const eApps = document.getElementById("apps");
    const ul = document.createElement("ul");
    eApps.appendChild(ul);

    for (let i = 0; i < apps.length; i += 1) {
      ul.appendChild(this.buildLi(i + 1, apps[i]));
    }

    onReady(() => document.querySelector("#apps > ul li:first-child")?.focus());
    this.menuContainer.buildComponent();
  }

  buildLi(tabindex, app) {
    const li = document.createElement("li");
    li.setAttribute("tabindex", tabindex);
    li.setAttribute("data-id", app.id);
    li.addEventListener("click", () =>
      window.app.runApp(app.id).catch((err) => alert(err))
    );
    li.innerHTML = `<span>${app.name}</span>`;

    return li;
  }

  listenerCommand(eventKey, cmd) {
    if (this.menuContainer.isActive()) {
      this.menuContainer.listenerCommand(eventKey, cmd);
      !this.menuContainer.isActive() && setTimeout(() => this.Refocus(), 100);
      return;
    }
    if (this.optionsContainer.isActive()) {
      this.optionsContainer.listenerCommand(eventKey, cmd);
      !this.optionsContainer.isActive() &&
        setTimeout(() => this.Refocus(), 100);
      return;
    }

    if (eventKey === EVENT_KEY.UP) {
      this.mapCommandsUp[cmd] && this.mapCommandsUp[cmd]();
    } else if (eventKey === EVENT_KEY.DOWN) {
      this.mapCommandsDown[cmd] && this.mapCommandsDown[cmd]();
    }
  }

  Refocus() {
    if (!document.querySelector("#apps > ul li:focus")) {
      Array.from(document.querySelectorAll("#apps > ul li"))
        ?.find((li) => li.getAttribute("tabindex") === this.tabindex)
        ?.focus();
    }
  }
}

class OptionsContainer {
  tabindex = "1";
  mapCommandsUp = {
    [COMMAND.OPTIONS]: () => this.activate(),
    [COMMAND.SELECT]: () => {
      document.querySelector("#options > ul li:focus")?.click();
    },
    [COMMAND.BACK]: () => {
      window.app.loadCollections();
    },
    [COMMAND.UP]: () => {
      const item = focusItem(
        Array.from(document.querySelectorAll("#options > ul li")),
        -1,
        true
      );
      this.tabindex = item.getAttribute("tabindex");
    },
    [COMMAND.DOWN]: () => {
      const item = focusItem(
        Array.from(document.querySelectorAll("#options > ul li")),
        1,
        true
      );
      this.tabindex = item.getAttribute("tabindex");
    },
  };

  async buildComponent() {
    const itemApp = document.querySelector("#apps > ul li:focus");
    if (!itemApp) return;

    const appId = Number(itemApp.dataset.id);
    const app = await window.app.getAppById(appId);

    let tabindex = 1;
    const container = document.getElementById("options");
    container.innerHTML = "";
    const ul = document.createElement("ul");
    container.appendChild(ul);

    for (const link of app.links) {
      const liLink = document.createElement("li");
      liLink.setAttribute("tabindex", tabindex);
      liLink.classList.add("link");
      liLink.addEventListener("click", async () => {
        await window.app.importApp(appId, link);
        window.app.runApp(appId);
      });
      liLink.innerHTML = `<span>${decodeURI(link.split("/").pop())}</span>`;
      ul.appendChild(liLink);
      tabindex += 1;
    }

    const liBack = document.createElement("li");
    liBack.setAttribute("tabindex", tabindex);
    liBack.classList.add("back");
    liBack.addEventListener("click", () => this.activate());
    liBack.innerHTML = "<span>Back</span>";
    ul.appendChild(liBack);
    container.classList.toggle("show");
    container.querySelector("& > ul li:first-child")?.focus();
  }

  activate() {
    document.getElementById("options").classList.toggle("show");
  }

  isActive() {
    return document.getElementById("options").classList.contains("show");
  }

  listenerCommand(eventKey, cmd) {
    if (eventKey === EVENT_KEY.UP) {
      this.mapCommandsUp[cmd] && this.mapCommandsUp[cmd]();
    }
  }
}

/* INIT */
const menuContainer = new MenuContainer();
const optionsContainer = new OptionsContainer();
const appScreen = new AppScreen(menuContainer, optionsContainer);
appScreen.buildScreen();

commandsRegisterListener((eventKey, cmd) =>
  appScreen.listenerCommand(eventKey, cmd)
);
