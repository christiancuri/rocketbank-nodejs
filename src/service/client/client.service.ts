import { Client, IClient, unmaskCPF } from "@/utils/models/Client";
import { HTTP400Error, HTTP404Error } from "@utils";

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

export async function updateClient(
  id: string,
  updateInfo: Partial<CreateClientPayload>,
) {
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
