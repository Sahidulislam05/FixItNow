import { DayOfWeek } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";

export interface IUpdateTechnicianProfilePayload {
    bio?: string;
    experienceYears?: number;
    skills?: string[];
}

export interface IAvailabilitySlot {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isActive?: boolean;
}

export interface ITechnicianQuery extends UserWhereInput {
    searchTerm?: string;
    categoryId?: string;
    minRating?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}
