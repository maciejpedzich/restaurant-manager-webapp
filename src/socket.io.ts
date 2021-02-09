import { io } from 'socket.io-client';

const socket = io(process.env.VUE_APP_API_URL);

export default socket;
