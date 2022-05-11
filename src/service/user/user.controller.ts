import { Res, Req } from "@types";

import * as service from "./user.service";

export async function getUserInfo(req: Req, reply: Res) {
  const { userId } = req.user;

  const user = await service.getUserInfo(userId);

  reply.send(user);
}
