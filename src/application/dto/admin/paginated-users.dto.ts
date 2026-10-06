export interface UserQueryOptions{
    page:number;
    limit:number;
}

export interface PaginatedUserResult<T>{
    users:T[],
    total:number;
    page:number;
    limit:number;
    pages:number;
}