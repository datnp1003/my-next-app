// Định nghĩa các type liên quan đến user
export type CreateUserInput = {
    email: string;
    name?: string;
    password: string;
  };
  
  export type UpdateUserInput = {
    email: string;
    name?: string;
    password?: string;
  };