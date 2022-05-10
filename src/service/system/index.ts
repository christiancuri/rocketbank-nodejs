import { FastifyInstance } from "fastify";

import { routes } from "./system.routes";

export const systemRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(routes, { prefix: "/system" });
};
