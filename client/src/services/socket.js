import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
  withCredentials: true,
  autoConnect: false
});

export const initSocket = (token) => {
  socket.auth = { token };
  socket.connect();
  return socket;
};

export default socket;