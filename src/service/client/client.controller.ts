import { Req, Res } from "@types";

import { Validator } from "@utils";

import * as service from "./client.service";

export async function getAllClients(
  req: Req<{
    Querystring: {
      skip?: number;
      limit?: number;
    };
  }>,
  reply: Res,
) {
  const { skip, limit } = req.query;

  const clients = await service.getAllClients({ skip, limit });

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

export async function updateClient(
  req: Req<{
    Body: service.CreateClientPayload;
    Params: {
      id: string;
    };
  }>,
  reply: Res,
) {
  const { id } = req.params;

  const client = await service.updateClient(id, req.body);

  reply.send(client);
}

export async function deleteClient(
  req: Req<{
    Params: {
      id: string;
    };
  }>,
  reply: Res,
) {
  const { id } = req.params;

  const client = await service.deleteClient(id);

  reply.send(client);
}
