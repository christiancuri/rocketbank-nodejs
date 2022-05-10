import { Server } from "socket.io";

import { onConnect } from "./services/user";

export async function socketListener(io: Server): Promise<void> {
  io.on("connect", (socket) => {
    onConnect(socket);
  });
}
