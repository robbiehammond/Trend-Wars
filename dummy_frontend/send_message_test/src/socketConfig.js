import openSocket from 'socket.io-client';

const ws = openSocket('localhost:8080');

export default ws;
