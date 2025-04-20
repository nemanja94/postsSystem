import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";

export default async function getAuthUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  try {
    const jwt = await decrypt(session);
    if (jwt !== undefined) {
      return jwt;
    }
  } catch (error) {
    return null;
  }

  return null;
}
