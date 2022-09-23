from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from Message import Message, MessageType
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
lobbies = []


# This function is called whenever a new player connects to the server
# We'd need to implement logic to make sure they get added to the game and whatnot
@socketio.on('connect')
def connect():
    pass


# This function is called whenever a player disconnects from the server 
# So if they close the tab or refresh the page
# We'd need to implement logic to make sure they get properly removed from the game
@socketio.on('disconnect')
def disconnect():
    pass

# Function is called whenever a client sends any information to the server
# The message is decoded, and the correct function is called based on the message type
def onMessage(msg):
    decodedMessage = Message.fromJSON(msg)
    print(decodedMessage)


def updateLobbies():
    for lobby in lobbies:
        lobby.update()

def main():
    msg = Message(MessageType.USERNAME, "Hello World")
    print(msg.toJSON())
    socketio.run(app, host='0.0.0.0', port='8080')
    
        
            


    

if __name__ == '__main__':
    main()