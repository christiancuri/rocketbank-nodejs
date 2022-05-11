import { FastifyInstance } from "fastify";

import { routes } from "./user.routes";

export const userRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(routes, { prefix: "/user" });
};
