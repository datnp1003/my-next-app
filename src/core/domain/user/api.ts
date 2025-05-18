import { PagingRequest } from "@/core/models/paging";

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