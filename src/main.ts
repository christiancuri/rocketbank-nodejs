import * as MongoDB from "./utils/MongoDB";

(async function () {
  await Promise.all([MongoDB.connect()]);

  const { router } = await import("./router.js");
  router();
})();
