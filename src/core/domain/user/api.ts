import { PagingRequest } from "@/core/models/paging";
import { User } from "next-auth";
// Import axios
import axios from 'axios';
import { UserVM } from "@/core/domain/user/user.model";

// Cấu hình base URL cho API
const api = axios.create({
  baseURL: '/api',
});

//hàm get user
const getUser = async () => {
    const res = await fetch('/api/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return data;
};

//hàm phân trang
const paging = async (req: PagingRequest) => {
    const res = await fetch('/api/user/paging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
    });
    const data = await res.json();
    return data;
}
export { getUser, paging };

// Hàm gọi API thêm user
export async function createUser(data: any) {
  const response = await api.post('/user', data);
  return response.data;
}

// Hàm gọi API cập nhật user
export async function updateUser(id: number, data: any) {
  const response = await api.put(`/user/${id}`, data);
  return response.data;
}

// Hàm gọi API xóa user
export async function deleteUser(id: number) {
  const response = await api.delete(`/user/${id}`);
  return response.data;
}

// Hàm gọi API lấy thông tin user theo id
export async function getUserById(id: number | string):Promise<UserVM> {
  const response = await api.get(`/user/${id}`);
  return response.data as UserVM;
}