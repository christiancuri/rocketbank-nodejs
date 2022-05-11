import { FastifyInstance } from "fastify";

import * as controller from "./system.controller";

export async function routes(fastify: FastifyInstance): Promise<void> {
  fastify
    .get("/check-availability/:email", controller.checkAvailability)
    .post("/login", controller.login)
    .post("/register", controller.register)

    /**
     * Dashboard
     */

    .get("/info", controller.getSystemInfo);
}
