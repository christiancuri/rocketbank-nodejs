import { FastifyInstance } from "fastify";

import { fastify } from "@utils";

import { clientRoutes } from "./service/client";
import { systemRoutes } from "./service/system";
import { userRoutes } from "./service/user";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pack = require("../package.json");

export async function router(): Promise<FastifyInstance> {
  const moduleRoutes = async (fastify: FastifyInstance): Promise<void> => {
    fastify.register(systemRoutes).register(clientRoutes).register(userRoutes);
  };

  fastify.register(moduleRoutes, { prefix: "/api" });

  fastify.get("/api/health", (_, reply) => {
    reply.send(`${pack.version} ok`);
  });

  return fastify;
}
