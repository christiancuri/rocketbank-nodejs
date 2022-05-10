import { Res, Req } from "@types";

import { Validator } from "@utils";

import * as service from "./system.service";

export async function checkAvailability(
  request: Req<{ Params: { email: string } }>,
  reply: Res,
) {
  const { email } = request.params;

  const available = await service.emailAvailable(email);

  reply.send({
    available,
  });
}

export async function login(
  request: Req<{ Body: { email: string; password: string } }>,
  reply: Res,
) {
  const { email, password } = Validator.validate(
    request.body,
    "email",
    "password",
  );

  const accessToken = await service.loginUser({ email, password });

  reply.send(accessToken);
}

export async function register(
  request: Req<{
    Body: { email: string; password: string; name: string };
  }>,
  reply: Res,
) {
  const { email, password, name } = Validator.validate(
    request.body,
    "email",
    "password",
    "name",
  );

  const accessToken = await service.registerUser({ email, password, name });

  reply.send(accessToken);
}
