import { ProfileRow } from "@/types/store";

export async function getCurrentProfile(): Promise<ProfileRow | null> {
  return {
    id: "local-admin",
    email: "local@example.com",
    role: "admin",
  };
}