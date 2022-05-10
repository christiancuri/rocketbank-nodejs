import { Client } from "@/utils/models/Client";

export async function getAllClients() {
  const clients = await Client.find().lean();

  return clients;
}
