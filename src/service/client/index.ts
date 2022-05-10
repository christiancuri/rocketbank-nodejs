import { FastifyInstance } from "fastify";

import { routes } from "./client.routes";

export const clientRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(routes, { prefix: "/client" });
};
