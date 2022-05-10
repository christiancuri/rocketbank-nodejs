/* eslint-disable @typescript-eslint/no-var-requires */
import * as MongoDB from "./utils/MongoDB";

(async function () {
  await Promise.all([MongoDB.connect()]);

  const { router } = require("./router");
  router();
})();
