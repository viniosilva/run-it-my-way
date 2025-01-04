class MenuContainer {
  mapCommandsUp = {
    [COMMAND.MENU]: () =>
      document.getElementById("menu").classList.toggle("show"),

    [COMMAND.UP]: () =>
      focusItem(
        Array.from(document.querySelectorAll("#menu > ul li")),
        -1,
        false
      ),
    [COMMAND.DOWN]: () =>
      focusItem(
        Array.from(document.querySelectorAll("#menu > ul li")),
        1,
        false
      ),
    [COMMAND.SELECT]: () => {
      document.querySelector("#menu > ul li:focus")?.click();
    },
  };

  buildComponent() {
    let tabindex = 1;
    const menu = document.getElementById("menu");
    menu.innerHTML = `<h2>MENU</h2>`;
    const ul = document.createElement("ul");
    menu.appendChild(ul);

    const liExit = document.createElement("li");
    liExit.setAttribute("tabindex", tabindex);
    liExit.classList.add("exit");
    liExit.addEventListener("click", () => window.app.exit());
    liExit.innerHTML = "<span>Exit</span>";
    ul.appendChild(liExit);
  }

  listenerCommand(eventKey, cmd) {
    if (eventKey === EVENT_KEY.UP) {
      this.mapCommandsUp[cmd] && this.mapCommandsUp[cmd]();
    }
  }

  isActive() {
    return document.getElementById("menu").classList.contains("show");
  }

  activate() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("show");

    menu.querySelector("& > ul li:first-child")?.focus();
  }
}
