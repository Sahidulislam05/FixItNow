import { Role } from "../../../generated/prisma/enums";

export interface IRegisterUserPayload {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: Role;
}

// এখানে শুধু generic account field — technician-specific ফিল্ড
// (bio, experienceYears, skills) technician.interface.ts এ আছে
export interface IUpdateProfilePayload {
    name?: string;
    phone?: string;
}
