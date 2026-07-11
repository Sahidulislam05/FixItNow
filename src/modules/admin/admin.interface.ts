import { ActiveStatus, Role } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";

export interface IAdminUserQuery extends UserWhereInput {
    searchTerm?: string;
    role?: Role;
    activeStatus?: ActiveStatus;
    page?: string;
    limit?: string;
}

export interface IUpdateUserStatusPayload {
    activeStatus: ActiveStatus;
}
