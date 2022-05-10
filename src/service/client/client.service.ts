import { Client, IClient, unmaskCPF } from "@/utils/models/Client";
import { HTTP400Error } from "@utils";

export async function getAllClients() {
  const clients = await Client.find().lean();

  return clients;
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

  return client.toObject();
}
