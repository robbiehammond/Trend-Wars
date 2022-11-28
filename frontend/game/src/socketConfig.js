import openSocket from 'socket.io-client';
export let server_location = null;
if (process.env.REACT_APP_LOCAL !== undefined) {
    console.log("Will be connecting to local server.")
    server_location = "http://localhost:8080"
}
else {
    console.log("Will be connecting to AWS server.")
    server_location = "http://3.143.255.96:8080"
}
export const ws = openSocket(server_location);
