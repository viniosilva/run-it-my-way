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

const gamepadMap = {
  12: COMMAND.UP,
  13: COMMAND.DOWN,
  14: COMMAND.LEFT,
  15: COMMAND.RIGHT,
  AxesUp: COMMAND.UP,
  AxesDown: COMMAND.DOWN,
  AxesLeft: COMMAND.LEFT,
  AxesRight: COMMAND.RIGHT,

  1: COMMAND.SELECT,
  0: COMMAND.BACK,

  9: COMMAND.MENU,
  2: COMMAND.OPTIONS,
};

const fpsInterval = 1000 / 10; // FPS;
let then = Date.now();
let elapsed = Date.now();
function animate(cb) {
  requestAnimationFrame(() => animate(cb));

  const now = Date.now();
  elapsed = now - then;
  if (elapsed <= fpsInterval) return;

  then = now - (elapsed % fpsInterval);
  cb();
}

function readGamepads(cb) {
  navigator.getGamepads().forEach((gp) => {
    if (!gp) return;

    gp.buttons.forEach((b, i) => {
      if (!b.pressed || b.value === 0) return;

      cb(EVENT_KEY.UP, gamepadMap[i]);
      cb(EVENT_KEY.DOWN, gamepadMap[i]);
    });

    if (gp.axes[1] < -0.5) {
      cb(EVENT_KEY.UP, gamepadMap["AxesUp"]);
      cb(EVENT_KEY.DOWN, gamepadMap["AxesUp"]);
    }
    if (gp.axes[1] > 0.5) {
      cb(EVENT_KEY.UP, gamepadMap["AxesDown"]);
      cb(EVENT_KEY.DOWN, gamepadMap["AxesDown"]);
    }
    if (gp.axes[0] < -0.5) {
      cb(EVENT_KEY.UP, gamepadMap["AxesLeft"]);
      cb(EVENT_KEY.DOWN, gamepadMap["AxesLeft"]);
    }
    if (gp.axes[0] > 0.5) {
      cb(EVENT_KEY.UP, gamepadMap["AxesRight"]);
      cb(EVENT_KEY.DOWN, gamepadMap["AxesRight"]);
    }
  });

  animate(() => readGamepads(cb));
}

function commandsRegisterListener(cb) {
  document.addEventListener("keydown", (e) => {
    e.preventDefault();
    cb(EVENT_KEY.DOWN, keyboardMap[e.key]);
  });

  document.addEventListener("keyup", (e) => {
    e.preventDefault();
    cb(EVENT_KEY.UP, keyboardMap[e.key]);
  });

  readGamepads(cb);
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
