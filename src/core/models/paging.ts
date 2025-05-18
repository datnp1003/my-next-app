export interface PagingRequest {
    page: number;
    pageSize: number;
    filter?: any;
}
export interface PagingResponse<T> {
    data: T[];
}