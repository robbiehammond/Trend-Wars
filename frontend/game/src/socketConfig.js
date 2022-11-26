import openSocket from 'socket.io-client';

const ws = openSocket('http://localhost:8080');

export default ws;
