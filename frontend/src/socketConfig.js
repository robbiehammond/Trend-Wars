import openSocket from 'socket.io-client';
export let server_location = null;
if (process.env.REACT_APP_LOCAL !== undefined) {
    console.log("Will be connecting to local server.")
    server_location = "http://localhost:8000"
}
else {
    console.log("Will be connecting to AWS Fargate Backend.")
    server_location = "34.220.237.175:8000"
}
export const ws = openSocket(server_location);
