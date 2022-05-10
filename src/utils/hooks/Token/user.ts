import { FastifyRequest } from "fastify";

import { UserProps } from "@types";

import { HTTP401Error } from "../../HttpErrors";
import * as TokenUtils from "../../TokenUtils";

export async function userTokenHook(request: FastifyRequest): Promise<void> {
  const { url } = request;

  if (request.method === "OPTIONS" || (url && !TokenUtils.needValidate(url)))
    return;

  const invalid = (expired = false) => {
    throw new HTTP401Error(`${expired ? "Expired" : "Invalid"} session`);
  };

  const { authorization } = request.headers;

  if (!authorization) return invalid(false);

  const { valid, expired, data } = await TokenUtils.validateToken<UserProps>({
    token: authorization,
  });

  if (!valid) return invalid(expired);

  request.user = data;

  return;
}
