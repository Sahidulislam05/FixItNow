export interface ICreateCategoryPayload {
    name: string;
    description?: string;
    icon?: string;
}

export interface IUpdateCategoryPayload {
    name?: string;
    description?: string;
    icon?: string;
}
