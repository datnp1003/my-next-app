import { PagingRequest } from "@/core/models/paging";
// Import axios
import axios from 'axios';
import { Product } from "./product.model";

// Cấu hình base URL cho API
const api = axios.create({
  baseURL: '/api',
});

//hàm get product
const getProduct = async () => {
    const res = await fetch('/api/product', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return data;
};

//hàm phân trang
const paging = async (req: PagingRequest) => {
    const res = await fetch('/api/product/paging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
    });
    const data = await res.json();
    return data;
}
export { getProduct, paging };

// Hàm gọi API thêm product
export async function createProduct(data: any) {
  const response = await api.post('/product', data);
  return response.data;
}

// Hàm gọi API cập nhật product
export async function updateProduct(id: number, data: any) {
  const response = await api.put(`/product/${id}`, data);
  return response.data;
}

// Hàm gọi API xóa product
export async function deleteProduct(id: number) {
  const response = await api.delete(`/product/${id}`);
  return response.data;
}

// Hàm gọi API lấy thông tin product theo id
export async function getProductById(id: number | string):Promise<Product> {
  const response = await api.get(`/product/${id}`);
  return response.data as Product;
}

//hàm get product by category
export async function getProductByCategory1() {
  const response = await api.get(`/product/skirt`);
  return response.data as Product[];
}

export async function getProductByCategory2() {
  const response = await api.get(`/product/dress`);
  return response.data as Product[];
}

export async function getProductByCategory3() {
  const response = await api.get(`/product/blouse`);
  return response.data as Product[];
}