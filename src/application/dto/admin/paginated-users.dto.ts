export type UserSortField = "createdAt" | "fullName" | "email";
export type UserSortDirection = "asc" | "desc";

export interface UserQueryOptions {
    page: number;
    limit: number;
    sortBy: UserSortField;
    sortOrder: UserSortDirection;
    search?: string;
}

export interface PaginatedUserResult<T> {
    users: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
