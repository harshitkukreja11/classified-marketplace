import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function getUserFromCookie() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("getUserFromCookie error:", error);
    return null;
  }
}