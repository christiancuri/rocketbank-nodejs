import { isValidObjectId } from "mongoose";

import { Client, IClient, unmaskCPF } from "@/utils/models/Client";
import {
  emitToSystem,
  HTTP400Error,
  HTTP404Error,
  PaginationParams,
  parsePagination,
  SocketEvents,
} from "@utils";

export async function getAllClients(pageParams: PaginationParams) {
  const { skip, limit } = parsePagination(pageParams);

  const [clients, totalClients] = await Promise.all([
    Client.find().skip(skip).limit(limit).sort({ _id: -1 }).lean(),
    Client.estimatedDocumentCount(),
  ]);

  return {
    clients,
    pages: Math.ceil(totalClients / limit),
    totalClients,
  };
}

export type CreateClientPayload = Pick<IClient, "name" | "birthdate" | "cpf">;

export async function createClient({
  name,
  cpf,
  birthdate,
}: CreateClientPayload) {
  const cpfExists = await Client.exists({
    cpf: unmaskCPF(cpf),
  });

  if (cpfExists)
    throw new HTTP400Error(`Client with CPF ${cpf} already exists.`);

  const client = await new Client({
    name,
    birthdate,
    cpf,
  }).save();

  emitToSystem(SocketEvents.NEW_CLIENT, client.toObject());

  return client.toObject();
}

export async function updateClient(
  id: string,
  updateInfo: Partial<CreateClientPayload>,
) {
  if (!isValidObjectId(id)) throw new HTTP400Error(`Invalid client id`);

  if (!Object.keys(updateInfo))
    throw new HTTP400Error(`Missing info to update on the client`);

  const client = await Client.findOne({
    _id: id,
  });

  if (!client) throw new HTTP404Error(`Client not found`);

  for (const [key, value] of Object.entries(updateInfo)) {
    client[key] = value;
  }

  await client.save();

  return client.toObject();
}

export async function deleteClient(id: string) {
  if (!isValidObjectId(id)) throw new HTTP400Error(`Invalid client id`);

  const client = await Client.findOneAndDelete({
    _id: id,
  });

  if (client) emitToSystem(SocketEvents.DELETE_CLIENT, client.toObject());

  return client;
}
