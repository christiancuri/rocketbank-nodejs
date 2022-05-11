import { User } from "@models";

export async function getUserInfo(userId: string) {
  const user = await User.findById(userId).select("name").lean();
  return user;
}
