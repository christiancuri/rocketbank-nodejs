import { Req, Res } from "@types";

import * as service from "./client.service";

export async function getAllClients(_req: Req, reply: Res) {
  const clients = await service.getAllClients();

  reply.send(clients);
}
