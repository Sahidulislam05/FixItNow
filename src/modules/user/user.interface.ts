import { Role } from "../../../generated/prisma/enums";

export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
}

export interface IUpdateProfilePayload {
  name?: string;
  phone?: string;
}
