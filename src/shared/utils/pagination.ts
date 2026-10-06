export const getPagination = (page:number,limit:number,)=>{
    return {
        skip:(page-1)*limit,
        limit,
    }
}