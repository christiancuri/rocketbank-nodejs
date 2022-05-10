import Fastify from "fastify";
import socketIo from "fastify-socket.io";

import { socketListener } from "@/socket";
import cors from "@fastify/cors";

import { ErrorHandle } from "./hooks/ErrorHandle";
import { userTokenHook } from "./hooks/Token";
import { logger } from "./logger";

export const fastify = Fastify({
  trustProxy: true,
  bodyLimit: 209715,
});

fastify
  .register(socketIo, {
    transports: ["websocket"],
    cors: {
      origin: (origin, cb) => {
        cb(null, origin);
      },
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      credentials: true,
    },
    allowRequest: (_req, cb) => {
      cb(null, true);
    },
  })
  .register(cors)
  .addHook("onResponse", async (request, reply) => {
    if (request.method !== "OPTIONS") {
      logger.info(
        `${request.ip} - [${new Date().toISOString()}] "${request.method} ${
          request.url
        } ${(reply.raw as any)._header.split(" ")[0]}" ${
          reply.statusCode
        } ${reply.getHeader("content-length")} "${
          request.headers["user-agent"]
        }"`,
      );
    }
  })
  .decorate("user", null)
  .decorateRequest("user", null)
  .addHook("preHandler", userTokenHook)
  .setErrorHandler(ErrorHandle);

const port = process.env.PORT || 5000;

fastify.ready().then(() => {
  logger.info(`[Server] Running on port ${port}`);
  socketListener(fastify.io);
});

fastify.listen(port, "0.0.0.0");
