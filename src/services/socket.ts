import io, { Socket } from 'socket.io-client';
import { StorageAdapter } from '../config/adapters/storage-adapter';
import { User } from '../infrastructure/interfaces/user';

let socket: Socket | null = null;

const connect = async () => {
  const user = await StorageAdapter.getItem<Partial<User>>('user');
  const token = user?.token;
  socket = io('http://localhost:3000', {
    auth: {
      token: token,
    },
  });
};

const disconnect = () => {
  if (socket) socket.disconnect();
};

export { socket, connect, disconnect };