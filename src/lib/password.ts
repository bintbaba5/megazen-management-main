import { hash, compare } from "bcryptjs";
export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  return hashedPassword;
};
export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  const isMatch = await compare(password, hashedPassword);
  return isMatch;
};
