import { Types } from "mongoose";

import { PV } from "@types";

import { fastify } from "@utils";

export enum SocketEvents {
  NEW_CLIENT = "client/new",
}

export async function emitToUser(
  userId: Types.ObjectId,
  event: string,
  data: Record<string, any>,
): PV {
  fastify.io.of("/").to(userId.toString()).emit(event, data);
}
