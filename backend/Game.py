class Lobby:
    def __init__(self):
        self.game = None
        self.players = [] 
        self.sockets = {} # retrieve a socket from a player id 