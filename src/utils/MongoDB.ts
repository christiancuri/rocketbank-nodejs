import mongoose from "mongoose";

import { Env } from "./Env";
import { logger } from "./logger";

function getOptions(): any {
  return {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
  };
}

export async function connect(pid = process.pid): Promise<void> {
  let resolve: () => void;
  const promise = new Promise((r: (...args: any) => void) => (resolve = r));

  const uri = Env.MONGO_SRV;
  const options = getOptions();

  mongoose.connect(uri, options);

  logger.info("[MongoDB] Starting connection");

  mongoose.connection.on("connected", () => {
    logger.info(`[MongoDB] Connected on PID ${pid}`);
    resolve();
  });

  mongoose.connection.on("disconneected", () => {
    logger.warn(`[MongoDB] Disconnected from `);
    process.exit(1);
  });

  mongoose.connection.on("error", (error) => {
    logger.error(`[MongoDB] Error on Connection: ${error.message}`);
    process.exit(1);
  });

  mongoose.connection.on("reconnected", () => {
    logger.info(`[MongoDB] Successfully reconnected on PID ${pid}`);
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      logger.warn(`[MongoDB] Disconnected by the end of service`);
      process.exit(0);
    });
  });

  return promise;
}
