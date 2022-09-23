from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from Message import Message, MessageType
from Handlers import * 
from Player import Player 
from Lobby import LobbyIDGenerator
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

lobbyIDGenerator = LobbyIDGenerator()
lobbies = [] # List of all active lobbies
socketToPlayers = {} # map socket connection to player  
nextValidId = 0 # Each player needs a unique ID: this variable keeps track of the next valid one to assign

# abstraction around socketio library
# unless you're messing with connection stuff, you probably don't need to worry about this 
class Socket:
    def __init__(self, sid):
        self.sid = sid
        self.connected = True

    def emit(self, event, data):
        socketio.emit(event, data, room=self.id)

    def getSocketID(self):
        return self.sid


def printConnectedPlayers():
    for s in socketToPlayers:
        print(s, socketToPlayers[s])


# This function is called whenever a new player connects to the server
@socketio.on('connect')
def connect():
    global nextValidId
    global socketToPlayers
    sock = Socket(request.sid)
    # N/A = username has not been set yet
    socketToPlayers[sock] = Player(nextValidId, "N/A", False)
    nextValidId += 1


# This function is called whenever a player disconnects from the server 
# i.e. if they close the tab or refresh the page
@socketio.on('disconnect')
def disconnect():
    # Have to loop over all sockets to remove the disconnected one
    # kinda ugly, but shouldn't be a problem if this game doesn't get too big (which it won't lol)
    global socketToPlayers
    for socket in socketToPlayers:
        sid = socket.getSocketID()
        if sid == request.sid:
            print("Player disconnected: ", socketToPlayers[socket])
            del socketToPlayers[socket]
            break
    


# Function is called whenever a client sends any information to the server
# The message is decoded, and the correct function is called based on the message type
@socketio.on('message')
def onMessage(msg):
    global lobbyIDGenerator
    decodedMessage = Message.fromJSON(msg)
    msgType = decodedMessage.msgType
    print(len(lobbies))

    # for each new message type we make, add a new case here for how to handle it + associated handler functio n
    match msgType:
        case "USERNAME":
            handleUsernameMsg(decodedMessage)
        case "PLAYER_JOIN":
            handlePlayerJoinMsg(decodedMessage)
        case "CREATE_LOBBY":
            sid = request.sid
            handleCreateLobbyMsg(decodedMessage, sid, socketToPlayers, lobbies, lobbyIDGenerator.generateNewID())
        case _:
            raise Exception(f'Invalid message type. A type of {msgType} was received, but no corresponding function exists')
            


def main():
    #msg = Message(MessageType.USERNAME, "Hello World")
    #print(msg.toJSON())
    socketio.run(app, host='0.0.0.0', port='8080')
    

    

if __name__ == '__main__':
    main()