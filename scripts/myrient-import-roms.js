import fs from "fs";
import got from "got";
import jsdom from "jsdom";
import linksJson from "./config/myrient-links.json" assert { type: "json" };

const { JSDOM } = jsdom;

async function main() {
  console.log("starting");
  const data = [];

  for (const { name, tag, url } of Object.values(linksJson)) {
    console.log(`getting ${name}`);
    const p = {
      name: name,
      tag: tag,
      games: [],
    };

    const res = await got(url);
    const dom = new JSDOM(res.body);

    const links = dom.window.document.querySelectorAll("td.link > a");
    for (const a of links) {
      if (a.textContent === "Parent directory/") continue;

      p.games.push({
        name: a.textContent,
        url: `${url}/${a.href}`,
      });
    }

    data.push(p);
    console.log(`${name} done: ${p.games.length}`);
  }

  console.log("creating roms data json");
  fs.writeFileSync(
    "data/myrient-list-roms.json",
    JSON.stringify(data, null, "  ")
  );
  console.log("roms data json created");

  console.log("end");
}

main();
