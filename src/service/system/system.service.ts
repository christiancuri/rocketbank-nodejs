import { User } from "@models";

import { Client } from "@/utils/models/Client";
import {
  TokenUtils,
  PasswordHelper,
  HTTP400Error,
  HTTP401Error,
  emitToSystem,
  SocketEvents,
} from "@utils";

export async function emailAvailable(email: string) {
  const emailExists = await User.exists({
    email: new RegExp(`^${email}$`, "i"),
  });

  return !emailExists;
}

export async function registerUser({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  const emailAlreadyRegistered = await emailAvailable(email);

  if (!emailAlreadyRegistered)
    throw new HTTP400Error(`Email already registered on the system`);

  const hash = await PasswordHelper.hash(password);

  const newUser = await User.create({
    name,
    hash,
    email,
  });

  emitToSystem(SocketEvents.NEW_USER, {
    name: newUser.name,
  });

  const accessToken = await TokenUtils.createToken({
    user: newUser.toObject(),
  });

  return {
    accessToken,
    user: {
      name: newUser.name,
    },
  };
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await User.findOne({
    email: new RegExp(`^${email}$`, "i"),
  })
    .select("+hash")
    .lean();

  if (!user) throw new HTTP400Error(`User not found.`);

  const passwordMatchs = await PasswordHelper.compare(password, user.hash);

  if (!passwordMatchs) throw new HTTP401Error(`Invalid password`);

  const accessToken = await TokenUtils.createToken({ user });

  return {
    accessToken,
    user: {
      name: user.name,
    },
  };
}

/**
 * Dashboard
 */

export async function getSystemInfo() {
  const [users, clients] = await Promise.all([
    User.estimatedDocumentCount(),
    Client.estimatedDocumentCount(),
  ]);

  return {
    users,
    clients,
  };
}
