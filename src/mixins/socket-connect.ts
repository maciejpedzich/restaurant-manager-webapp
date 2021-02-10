import socket from '@/socket.io';

const socketConnectMixin = {
  created() {
    socket.connect();
  },
  unmounted() {
    socket.disconnect();
  }
};

export default socketConnectMixin;
