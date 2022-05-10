import { sign, verify } from "jsonwebtoken";

import { Env } from "./Env";
import { IUser } from "./models/User";
import * as TokenCrypt from "./TokenCrypt";
import { UserProps } from "./types";

const PK = Env.Token.SecretKey;

async function _createToken(key: string, content: Record<string, any>) {
  const encryptedContent = await TokenCrypt.encrypt(
    String(key),
    JSON.stringify(content),
  );
  const token = sign(
    {
      token: encryptedContent,
    },
    PK,
    {
      expiresIn: Env.Token.ExpiresIn,
    },
  );
  return TokenCrypt.encrypt(String(key), token);
}

export async function createToken({ user }: { user: IUser }) {
  const { _id: userId } = user;

  const tokenContent: UserProps = {
    _id: userId.toString(),
    userId: userId.toString(),
  };

  return _createToken(userId.toString(), tokenContent);
}

export async function validateToken<T>({ token }: { token: string }): Promise<{
  valid: boolean;
  expired: boolean;
  data?: T;
}> {
  const jwt = await TokenCrypt.decrypt(token);

  const invalid = (expired = false) => ({
    valid: false,
    expired,
    data: undefined,
  });
  const valid = (info: T) => ({
    valid: true,
    expired: false,
    data: info,
  });

  if (!jwt) return invalid(false);

  try {
    const jwtData = verify(jwt, PK, {});
    if (!jwtData.token) return invalid(false);
    const data = await TokenCrypt.decrypt(jwtData.token);
    const userData: T = JSON.parse(data);
    return valid(userData);
  } catch (error) {
    return invalid(false);
  }
}

export function needValidate(url: string): boolean {
  const whitelist = [
    "/api/system/login",
    "/api/system/check-availability/",
    "/api/system/register",
    "/api/health",
  ];

  for (const wlUrl of whitelist) if (url.startsWith(wlUrl)) return false;

  return true;
}
