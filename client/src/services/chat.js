import api from './api';

export const getMessages = async (roomId) => {
  const response = await api.get(`/chat/messages/${roomId}`);
  return response.data;
};

export const sendMessage = async (roomId, text, file) => {
  const response = await api.post('/chat/messages', { room: roomId, text, file });
  return response.data;
};

export const reactToMessage = async (messageId, reaction) => {
  const response = await api.put(`/chat/messages/${messageId}/react`, { reaction });
  return response.data;
};

export const deleteMessage = async (messageId) => {
  const response = await api.delete(`/chat/messages/${messageId}`);
  return response.data;
};