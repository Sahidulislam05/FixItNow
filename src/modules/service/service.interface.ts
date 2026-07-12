import { ServiceWhereInput } from "../../../generated/prisma/models";

export interface ICreateServicePayload {
  categoryId: string;
  title: string;
  description?: string;
  price: number;
  location?: string;
}

export interface IUpdateServicePayload {
  categoryId?: string;
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  isActive?: boolean;
}

export interface IServiceQuery extends ServiceWhereInput {
  searchTerm?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  location?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}
