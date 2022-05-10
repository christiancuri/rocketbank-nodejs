import { FastifyInstance } from "fastify";

import * as controller from "./client.controller";

export async function routes(fastify: FastifyInstance): Promise<void> {
  fastify
    .get("/", controller.getAllClients)
    .post("/", controller.createClient)
    .put("/:id", controller.updateClient);
}
