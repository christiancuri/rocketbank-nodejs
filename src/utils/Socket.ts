import { Types } from "mongoose";

import { PV } from "@types";

import { fastify } from "@utils";

export enum SocketEvents {
  NEW_CLIENT = "client/new",
  DELETE_CLIENT = "client/delete",
  NEW_USER = "system/user/new",
}

export async function emitToUser(
  userId: Types.ObjectId,
  event: SocketEvents,
  data: Record<string, any>,
): PV {
  fastify.io.of("/").to(userId.toString()).emit(event, data);
}

export async function emitToSystem(
  event: SocketEvents,
  data: Record<string, any>,
) {
  fastify.io.of("/").emit(event, data);
}
