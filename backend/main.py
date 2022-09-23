from cgi import test
from pydoc import plain
import warnings
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from Message import Message, MessageType
from Handlers import * 
from Player import Player 
from Lobby import LobbyIDGenerator
import json

# connection setup stuff
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

lobbyIDGenerator = LobbyIDGenerator() # struct to easily generate unique, 6-uppercase-letter lobby IDs 
lobbies = [] # List of all active lobbies
socketToPlayers = {} # map socket connection to player  
idToPlayer = {} #map player id to player object for quick access
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
# Note that it takes a while before the disconnect is registered, so when testing, it might say there are more players connected then there really are
# They (should) be removed eventually however
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
    global lobbies 
    global socketToPlayers

    decodedMessage = Message.fromJSON(msg)
    sendingPlayer = None

    # Check if we've registered this player (we should have whenever this function is called)
    # "Registering a player" -> mapping a socket (i.e. individual connection) to a player object
    if (Socket(request.sid) in socketToPlayers):
        sendingPlayer = socketToPlayers[Socket(request.sid)]
    else:
        warnings.warn("Warning: Socket not associated with a player. \'none\' will be used as the sending player. Bad things will probably happen")


    #if the player who sent this message has been registered and is in a lobby/game, handle the message there
    if sendingPlayer is not None and sendingPlayer.lobbyID is not None:
        handleInGameRequest(decodedMessage, sendingPlayer, socketToPlayers, request.sid, lobbies)


    msgType = decodedMessage.msgType
    # Most messages will be interpreted by the player's corresponding lobby and are routed there 
    # However, some must be interpreted before a player is in any lobby
    # for each new message type we make, add a new case here for how to handle it + associated handler function
    match msgType:
        case "USERNAME":
            handleUsernameMsg(decodedMessage)
        case "PLAYER_JOIN":
            handlePlayerJoinMsg(decodedMessage)
        case "CREATE_LOBBY":
            sid = request.sid
            handleCreateLobbyMsg(decodedMessage, sendingPlayer, socketToPlayers, sid, lobbies, lobbyIDGenerator.generateNewID())
        case _:
            raise Exception(f'Invalid message type. A type of {msgType} was received, but no corresponding function exists')
            


# Similar to on message, but stuff doesn't need to be passed with a socket
# We will get rid of this once more of the frontend <-> backend communication is set up 
def onMessageLocal(msg):
    global idToPlayer
    global lobbies
    decodedMessage = Message.fromJSON(msg)
    sendingPlayerID = decodedMessage.msgData["playerID"]
    msgType = decodedMessage.msgType

    for lobby in lobbies:
        if sendingPlayerID in lobby.playerIDs:
            lobby.handleMessage(decodedMessage, idToPlayer, sendingPlayerID)




# Tests the functionality of the lobby and game, without having to mess with frontend/connection stuff
# Things still are passed in message format, so it's still mostly 'realistic' in the context of the game and lobby
def testLobbyAndGame():
    global idToPlayer
    global lobbies

    # create some test players 
    test_player1 = Player(0, "test1", False)
    test_player2 = Player(1, "test2", False)
    idToPlayer[0] = test_player1
    idToPlayer[1] = test_player2

    # create a tes tlobby
    test_lobby = Lobby("AAAAAA")
    lobbies.append(test_lobby)

    # simulate adding players to the lobby 
    test_lobby.addPlayer(test_player1)
    test_lobby.addPlayer(test_player2)
    test_player1.lobbyID = test_lobby.id
    test_player2.lobbyID = test_lobby.id

    # simulate players readying up in the lobby
    onMessageLocal(Message(MessageType.READY, {"playerID": test_player1.id} ).toJSON())
    onMessageLocal(Message(MessageType.READY, {"playerID": test_player2.id}).toJSON())
    onMessageLocal(Message(MessageType.START_GAME, {"playerID": test_player1.id}).toJSON())

    test_lobby.printLobbyState()

    # simulate round 1
    onMessageLocal(Message(MessageType.SUBMIT_WORD, { "word": "big", "playerID": test_player1.id }).toJSON())
    onMessageLocal(Message(MessageType.SUBMIT_WORD, { "word": "hairy", "playerID": test_player2.id }).toJSON())
    test_lobby.printLobbyState()

    # simulate round 2
    onMessageLocal(Message(MessageType.SUBMIT_WORD, { "word": "large", "playerID": test_player1.id }).toJSON())
    onMessageLocal(Message(MessageType.SUBMIT_WORD, { "word": "tiny", "playerID": test_player2.id }).toJSON())
    test_lobby.printLobbyState()

    # simulate round 3 
    onMessageLocal(Message(MessageType.SUBMIT_WORD, { "word": "mega", "playerID": test_player1.id }).toJSON())
    onMessageLocal(Message(MessageType.SUBMIT_WORD, { "word": "giga", "playerID": test_player2.id }).toJSON())
    test_lobby.printLobbyState()

    # simulate round 4
    onMessageLocal(Message(MessageType.SUBMIT_WORD, { "word": "huge", "playerID": test_player1.id }).toJSON())
    onMessageLocal(Message(MessageType.SUBMIT_WORD, { "word": "small", "playerID": test_player2.id }).toJSON())
    test_lobby.printLobbyState()


    # simulate round 5 (game should end here)
    onMessageLocal(Message(MessageType.SUBMIT_WORD, { "word": "nonexistant", "playerID": test_player1.id }).toJSON())
    onMessageLocal(Message(MessageType.SUBMIT_WORD, { "word": "scary", "playerID": test_player2.id }).toJSON())



def main():
    #msg = Message(MessageType.USERNAME, "Hello World")
    #print(msg.toJSON())
    testLobbyAndGame()
    #socketio.run(app, host='0.0.0.0', port='8080')
    

if __name__ == '__main__':
    main()