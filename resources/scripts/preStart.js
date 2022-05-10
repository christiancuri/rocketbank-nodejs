const fs = require("fs");
const path = require("path");
const { Builder } = require("../JsonToTs");

const ENV_PATH = path.join(__dirname, "../../env.json");
const TYPINGS_PATH = path.join(__dirname, "../../src/utils/Env/typings.ts");

async function createTypings(jsonPath, destPath) {
  const json = fs.readFileSync(jsonPath, "utf-8");

  const typings = new Builder({ rootObjectName: "IEnv" }).build(json);

  fs.writeFileSync(destPath, typings);
}

(async () => {
  await createTypings(ENV_PATH, TYPINGS_PATH);
  console.log("Created Env.ts");
})();
