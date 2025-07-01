import { createContext, useContext } from 'react';

export const SocketContext = createContext();

export const SocketProvider = SocketContext.Provider;

export const useSocket = () => useContext(SocketContext);