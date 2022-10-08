from flask_socketio import SocketIO, emit
from Player import Player

# abstraction around socketio library
# unless you're messing with connection stuff, you probably don't need to worry about this 
class Socket:
    def __init__(self, socketio, sid):
        self.sid = sid
        self.connected = True
        self.socketio = socketio

    def emit(self, event, data):
        self.socketio.emit(event, data, room=self.id)

    def getSocketID(self):
        return self.sid

class ConnectionManager:
    def __init__(self, app, socketio):
        self.connections = []
        self.nextValidId = 0
        self.socketToPlayer = {}
        self.sidToPlayer = {}
        self.idToPlayer = {}
        self.app = app
        self.socketio = socketio
        self.activeSids = []

    def add_connection(self, req):
        sid = req.sid
        self.activeSids.append(sid)
        sock = Socket(self.app, sid)
        self.connections.append(sock)
        player = Player(self.nextValidId, "N/A", False)
        self.socketToPlayer[sock] = player
        self.sidToPlayer[sid] = player
        self.nextValidId += 1
        print("New connection added. Total connections: ", len(self.connections))

    # This function is called whenever a player disconnects from the server 
    # i.e. if they close the tab or refresh the page
    # Note that it takes a while before the disconnect is registered, so when testing, it might say there are more players connected then there really are
    # They (should) be removed eventually however
    def remove_connection(self, req):
        # Have to loop over all sockets to remove the disconnected one
        # kinda ugly, but shouldn't be a problem if this game doesn't get too big (which it won't lol)
        sid = req.sid
        self.activeSids.remove(sid)
        for sock in self.connections:
            if sock.getSocketID() == sid:
                self.connections.remove(sock)
                del self.socketToPlayer[sock]
                break
        print("Connection removed. Total connections: ", len(self.connections))

    def is_connected(self, sid):
        return sid in self.activeSids

    def get_player(self, sid):
        return self.sidToPlayer[sid]

    def get_sid_to_player(self):
        return self.sidToPlayer

    

    

