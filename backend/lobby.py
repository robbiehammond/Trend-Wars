import random
import string
from Game import Game 
from Player import Player

class Lobby:
    def __init__(self, id):
        self.game = None
        self.id = id
        self.players = [] 
        self.sockets = {} # retrieve a socket from a player id 

    def handleMessage(self, message):
        msgType = message.msgType
        match msgType:
            # insert cases for this lobby to handle certain types of messages
            case _:
                raise Exception(f'Invalid message type. A type of {msgType} was received by lobby {self.id}, but no corresponding function exists')



    def addPlayer(self, player):
        self.players.append(player)

    # If there are 2 or more players and they're all ready, game can start
    def gameCanStart(self):
        return len(self.players) >= 2 and all([player.ready for player in self.players])

    def startGame(self):
        self.game = Game(self.players)

    def update(self):
        pass


class LobbyIDGenerator:
    def __init__(self):
        self.nextValidId = 0
        self.IDsInUse = []

    def reset(self):
        self.IDsInUse = []

    def generateNewID(self):
        # looks ugly, but it just generates a random string of 6 uppercase letters: that'll be the lobby's ID
        newID = ''.join(random.choice(string.ascii_uppercase) for _ in range(6)) 

        # recursively try again if generated ID is already in use
        # if we ever need more than 26^6 lobbies, we'll certainly have to change this
        # but I'm 100% we'll never even hit 0.0001% of that number, so it's fine
        if (newID in self.IDsInUse):
            return self.generateNewID()
        else:
            return newID
