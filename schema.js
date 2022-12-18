const fs = require("fs");

function orderKeys(obj) {
  var keys = Object.keys(obj).sort(function keyOrder(k1, k2) {
    if (k1 < k2) return -1;
    else if (k1 > k2) return +1;
    else return 0;
  });

  var i,
    after = {};
  for (i = 0; i < keys.length; i++) {
    after[keys[i]] = obj[keys[i]];
    delete obj[keys[i]];
  }

  for (i = 0; i < keys.length; i++) {
    obj[keys[i]] = after[keys[i]];
  }
  return obj;
}

const categories = fs.readdirSync(`./languages/en-GB/`);
const output = {};

categories.forEach((cateogory) => {
  const files = fs
    .readdirSync(`./languages/en-GB/${cateogory}/`)
    .filter((file) => file.endsWith(".json"));

  for (const file of files) {
    const fileContent = require(`./languages/en-GB/${cateogory}/${file}`);
    const fileKeys = Object.keys(fileContent);
    for (const key of fileKeys) {
      output[`${file.replace(".json", "")}.${key}`] = fileContent[key];
    }
  }
});

fs.writeFileSync(
  `./translation/schema.json`,
  JSON.stringify(orderKeys(output), null, 2),
  "utf-8"
);
