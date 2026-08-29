import { User } from "@types/types";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

