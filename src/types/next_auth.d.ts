// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    userDetails?: Record<string, unknown>;
    user: DefaultSession["user"];
  }

  interface User {
    userDetails?: Record<string, unknown>;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    userDetails?: Record<string, unknown>;
  }
}