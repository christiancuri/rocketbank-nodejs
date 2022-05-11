import { FastifyInstance } from "fastify";

import * as controller from "./user.controller";

export async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get("/", controller.getUserInfo);
}
