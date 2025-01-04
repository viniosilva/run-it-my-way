const COMMAND = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,

  SELECT: 5,
  BACK: 6,

  MENU: 7,
  OPTIONS: 8,
};

const EVENT_KEY = {
  UP: 1,
  DOWN: 2,
};

const keyboardMap = {
  ArrowUp: COMMAND.UP,
  ArrowDown: COMMAND.DOWN,
  ArrowLeft: COMMAND.LEFT,
  ArrowRight: COMMAND.RIGHT,

  " ": COMMAND.SELECT,
  Enter: COMMAND.SELECT,
  Backspace: COMMAND.BACK,

  Escape: COMMAND.MENU,
  Shift: COMMAND.OPTIONS,
};

function commandsRegisterListener(cb) {
  document.addEventListener("keydown", (e) => {
    e.preventDefault();
    cb(EVENT_KEY.DOWN, keyboardMap[e.key]);
  });

  document.addEventListener("keyup", (e) => {
    e.preventDefault();
    cb(EVENT_KEY.UP, keyboardMap[e.key]);
  });
}

function commandsBuildComponent() {
  document.getElementById(
    "commands"
  ).innerHTML = `<span class="menu">Menu</span>
        <span class="choose">Choose</span>
        <span class="select">Select</span>
        <span class="options">Options</span>
        <span class="back">Back</span>`;
}
