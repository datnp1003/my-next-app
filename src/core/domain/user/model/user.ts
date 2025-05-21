export interface UserRequest {
    email: string;
    password: string;
    name: string;
}
export interface UserResponse<T> {
    data: T[];
}