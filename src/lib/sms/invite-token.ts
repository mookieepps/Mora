import { randomBytes } from "crypto";

export function createInviteToken(): string {
  return randomBytes(32).toString("hex");
}
