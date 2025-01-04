class CollectionScreen {
  tabindex = "1";
  mapCommandsUp = {
    [COMMAND.MENU]: () => this.menuContainer.activate(),
    [COMMAND.LEFT]: () => {
      const items = Array.from(
        document.querySelectorAll("#collections > ul li")
      );
      const item = focusItem(items, -1);
      this.tabindex = item.getAttribute("tabindex");
    },
    [COMMAND.RIGHT]: () => {
      const items = Array.from(
        document.querySelectorAll("#collections > ul li")
      );
      const item = focusItem(items, 1);
      this.tabindex = item.getAttribute("tabindex");
    },
    [COMMAND.SELECT]: () => {
      document.querySelector("#collections  > ul li:focus")?.click();
    },
  };

  constructor(menuContainer) {
    this.menuContainer = menuContainer;
  }

  async buildScreen() {
    const group = await window.app.getGroup();
    document.getElementById("title").textContent = group.name;

    const collections = document.getElementById("collections");
    const ul = document.createElement("ul");
    collections.appendChild(ul);

    for (let i = 0; i < group.collections.length; i += 1) {
      ul.appendChild(this.buildLi(i + 1, group.collections[i]));
    }

    onReady(() => collections.querySelector("& > ul li:first-child")?.focus());
    this.menuContainer.buildComponent();
  }

  buildLi(tabindex, collection) {
    const li = document.createElement("li");

    li.setAttribute("tabindex", tabindex);
    li.addEventListener("click", () => window.app.loadApps(collection.id));

    li.innerHTML = `
      <img src="${collection.img}" alt="${collection.name}" />
      <span>${collection.name}</span>
    `;

    return li;
  }

  listenerCommand(eventKey, cmd) {
    if (this.menuContainer.isActive()) {
      this.menuContainer.listenerCommand(eventKey, cmd);
      !this.menuContainer.isActive() && setTimeout(() => this.Refocus(), 100);
      return;
    }

    if (eventKey === EVENT_KEY.UP) {
      this.mapCommandsUp[cmd] && this.mapCommandsUp[cmd]();
    }
  }

  Refocus() {
    if (!document.querySelector("#collections > ul li:focus")) {
      Array.from(document.querySelectorAll("#collections > ul li"))
        ?.find((li) => li.getAttribute("tabindex") === this.tabindex)
        ?.focus();
    }
  }
}

/* INIT */
const menuContainer = new MenuContainer();
const collectionScreen = new CollectionScreen(menuContainer);
collectionScreen.buildScreen();

commandsRegisterListener((eventKey, cmd) =>
  collectionScreen.listenerCommand(eventKey, cmd)
);
