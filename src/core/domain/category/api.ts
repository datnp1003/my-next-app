import { PagingRequest } from "@/core/models/paging";
// Import axios
import axios from 'axios';
import { Category } from "@/core/domain/category/category.model";

// Cấu hình base URL cho API
const api = axios.create({
  baseURL: '/api',
});

//hàm get category
const getCategory = async () => {
    const res = await fetch('/api/category', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return data;
};

//hàm phân trang
const paging = async (req: PagingRequest) => {
    const res = await fetch('/api/category/paging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
    });
    const data = await res.json();
    return data;
}
export { getCategory, paging };

// Hàm gọi API thêm category
export async function createCategory(data: any) {
  const response = await api.post('/category', data);
  return response.data;
}

// Hàm gọi API cập nhật category
export async function updateCategory(id: number, data: any) {
  const response = await api.put(`/category/${id}`, data);
  return response.data;
}

// Hàm gọi API xóa category
export async function deleteCategory(id: number) {
  const response = await api.delete(`/category/${id}`);
  return response.data;
}

// Hàm gọi API lấy thông tin category theo id
export async function getCategoryById(id: number | string):Promise<Category> {
  const response = await api.get(`/category/${id}`);
  return response.data as Category;
}