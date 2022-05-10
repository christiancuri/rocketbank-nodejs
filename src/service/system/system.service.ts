import { User } from "@models";

import { TokenUtils, PasswordHelper, HTTP400Error, HTTP401Error } from "@utils";

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

  const accessToken = await TokenUtils.createToken({
    user: newUser.toObject(),
  });

  return {
    accessToken,
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
  };
}
