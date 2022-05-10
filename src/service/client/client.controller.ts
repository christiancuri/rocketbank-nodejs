import { Req, Res } from "@types";

import { Validator } from "@utils";

import * as service from "./client.service";

export async function getAllClients(_req: Req, reply: Res) {
  const clients = await service.getAllClients();

  reply.send(clients);
}

export async function createClient(
  req: Req<{
    Body: service.CreateClientPayload;
  }>,
  reply: Res,
) {
  const { name, birthdate, cpf } = Validator.validate(
    req.body,
    "name",
    "birthdate",
    "cpf",
  );

  const client = await service.createClient({ name, birthdate, cpf });

  reply.send(client);
}
