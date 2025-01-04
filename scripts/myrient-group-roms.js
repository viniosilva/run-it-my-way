import fs from "fs/promises";
import romsJson from "./data/myrient-list-roms.json" assert { type: "json" };
import cmdsJson from "./data/myrient-cmd.json" assert { type: "json" };

let groupId = 1;
let collectionId = 1;
let appId = 1;

async function main() {
  console.log("starting");

  const apps = [];
  const group = {
    id: groupId,
    name: "Consoles",
    collections: [],
  };

  for (let i = 0; i < romsJson.length; i += 1) {
    const myrientConsole = romsJson[i];

    console.log(`getting ${myrientConsole.name}`);

    group.collections.push({
      id: collectionId,
      name: myrientConsole.name,
      img: "",
    });

    const titles = Array.from(
      new Set(myrientConsole.games.map(({ name }) => getAppName(name)))
    );

    for (const title of titles) {
      console.log(`[${myrientConsole.name}] getting app ${title}`);

      const app = {
        id: appId,
        name: title,
        cmd: `${cmdsJson[myrientConsole.name]} \{FILE_PATH\}`,
        collections: [collectionId],
        links: [],
      };
      appId += 1;

      const games = myrientConsole.games.filter(({ name }) =>
        name.startsWith(title)
      );
      for (const game of games) {
        console.log(`[${game.name}] adding links to app ${app.name}`);
        app.links.push(game.url);
      }

      apps.push(app);
    }
    collectionId += 1;
  }

  console.log("creating group");
  await mkdir("data/groups");
  await fs.writeFile(
    "data/groups/consoles.json",
    JSON.stringify(group, null, "  ")
  );
  console.log("creating apps");
  await mkdir("data/apps");
  for (const app of apps) {
    console.log(`[${app.collections[0]}] creating app ${app.name}`);

    const letter = getLetterFolder(app.name);
    const name = normalizeStr(app.name);
    await mkdir(`data/apps/${letter}`);
    await fs.writeFile(
      `data/apps/${letter}/${name}.json`,
      JSON.stringify(app, null, "  ")
    );
  }

  console.log("end");
}

main();

function getAppName(name) {
  return name.split(" (")[0];
}

async function mkdir(path) {
  try {
    await fs.mkdir(path);
  } catch (e) {}
}

function normalizeStr(value) {
  return value.toLowerCase().replaceAll(" ", "_");
}

function getLetterFolder(value) {
  const letter = value.substr(0, 1).toLowerCase();

  return /[a-zA-Z]/.test(letter) ? letter : "#";
}
