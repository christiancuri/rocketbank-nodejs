import { Socket } from "socket.io";

import { PV, UserProps } from "@types";

import { TokenUtils } from "@utils";

export async function onConnect(socket: Socket): PV {
  const token = socket?.handshake?.query?.authorization as string;

  const invalid = () => {
    socket.disconnect();
  };

  const { valid, data } = await TokenUtils.validateToken<UserProps>({
    token,
  });

  if (!valid) return invalid();

  socket.join(data.userId);

  socket.emit(`/status`, "connected");
}
