from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from Message import Message, MessageType
from Handlers import * 
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
lobbies = []
sockets = {} # map socket connection to player  


# This function is called whenever a new player connects to the server
@socketio.on('connect')
def connect():
    print("client connected")
    pass


# This function is called whenever a player disconnects from the server 
# i.e. if they close the tab or refresh the page
@socketio.on('disconnect')
def disconnect():
    print("client disconnected")
    pass


# Function is called whenever a client sends any information to the server
# The message is decoded, and the correct function is called based on the message type
@socketio.on('message')
def onMessage(msg):
    decodedMessage = Message.fromJSON(msg)
    msgType = decodedMessage.msgType

    # for each new message type we make, add a new case here for how to handle it + associated handler functio n
    match msgType:
        case "USERNAME":
            handleUsernameMsg(decodedMessage)
        case "READY":
            handleReadyMsg(decodedMessage)
        case "PLAYER_JOIN":
            handlePlayerJoinMsg(decodedMessage)
        case "PLAYER_LEAVE":
            handlePlayerLeaveMsg(decodedMessage)
        case "CREATE_LOBBY":
            handleCreateLobbyMsg(decodedMessage)
        case "LOBBY_STATE":
            handleLobbyStateMsg(decodedMessage)
        case _:
            raise Exception(f'Invalid message type. A type of {msgType} was received, but no corresponding function exists')
            


def main():
    msg = Message(MessageType.USERNAME, "Hello World")
    print(msg.toJSON())
    socketio.run(app, host='0.0.0.0', port='8080')
    

    

if __name__ == '__main__':
    main()