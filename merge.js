const fs = require("fs");

const translationSchema = require("./translation/schema.json");
const languages = fs.readdirSync("./languages");

const output = {};

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

languages.forEach((direct) => {
  const categories = fs.readdirSync(`./languages/${direct}/`);
  output[direct] = translationSchema;

  categories.forEach((cateogory) => {
    const files = fs
      .readdirSync(`./languages/${direct}/${cateogory}/`)
      .filter((file) => file.endsWith(".json"));

    for (const file of files) {
      const fileContent = require(`./languages/${direct}/${cateogory}/${file}`);
      const fileKeys = Object.keys(fileContent);
      for (const key of fileKeys) {
        output[direct][`${file.replace(".json", "")}.${key}`] =
          fileContent[key];
      }
    }

    output[direct] = orderKeys(output[direct]);
  });
});

fs.writeFileSync(
  `./translation/all.json`,
  JSON.stringify(output, null, 2),
  "utf-8"
);
