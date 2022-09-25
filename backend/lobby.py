import random
import string
from Game import Game 
from Player import Player
from Handlers import sendToAllInLobby, sendToPlayer

class Lobby:
    def __init__(self, id):
        self.game = None
        self.id = id
        self.playerIDs = set() # set of player IDs in this lobby (so we don't need to loop over players list to see who's here)
        self.players = [] 
        self.sockets = {} # retrieve a socket from a player id 

    # Works the same way as the socketio.on('message') function in main.py
    def handleMessage(self, message, idToPlayer, sendingPlayerID):
        msgType = message.msgType
        player = idToPlayer[sendingPlayerID]

        match msgType:
            case "READY":
                player.ready = True
            case "START_GAME":
                if self.gameCanStart():
                    self.startGame()
                else:
                    print("Game cannot start yet. Probably want to send a message to the frontend to tell them why")
            case "SUBMIT_WORD":
                if self.game is not None:
                    self.game.processPlayerSubmission(player, message.msgData['word'])
            case "READY_FOR_NEXT_ROUND":
                self.game.processReadyForNextRound(player)
            # insert cases for this lobby to handle certain types of messages
            case _:
                raise Exception(f'Invalid message type. A type of {msgType} was received by lobby {self.id}, but no corresponding function exists')


    def addPlayer(self, player):
        self.players.append(player)
        self.playerIDs.add(player.id)


    def removePlayer(self, player):
        id = player.id
        self.players.remove(player)
        self.playerIDs.remove(id)


    # If there are 2 or more players and they're all ready, game can start
    def gameCanStart(self):
        return len(self.players) >= 2 and all([player.ready for player in self.players])


    def startGame(self):
        self.game = Game(self.players, 5)


    def printLobbyState(self):
        print("=====================================")
        print("Lobby " + self.id + " state:")
        for player in self.players:
            print(player)
        gameStarted = self.game is not None
        print(f"Game started?: {gameStarted}")
        if gameStarted:
            print('{' + str(self.game) + '}')
        print("=====================================")
        print()




class LobbyIDGenerator:
    def __init__(self):
        self.nextValidId = 0
        self.IDsInUse = []

    def reset(self):
        self.IDsInUse = []

    
    def removeID(self, id):
        self.IDsInUse.remove(id)

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
