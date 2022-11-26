import openSocket from 'socket.io-client';

const ws = openSocket('http://3.143.255.96:8080');

export default ws;
