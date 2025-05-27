import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const createMessage = async (data: {
  content: string;
  senderId?: number;
  receiverId?: number;
  isBot: boolean;
}) => {
  const response = await api.post('/messages', data);
  return response.data;
};

export const getAdminUser = async () => {
  const response = await api.get('/users/admin');
  return response.data;
};