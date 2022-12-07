import random
import string
from Game import Game 
from Player import Player
from Handlers import *
from ConnectionManager import ConnectionManager
from Message import Message, MessageType
from termcolor import colored
import warnings

class Lobby:
    def __init__(self, id, CM: ConnectionManager):
        self.game = None
        self.id = id
        self.playerIDs = set() # set of player IDs in this lobby (so we don't need to loop over players list to see who's here)
        self.players = [] 
        self.sockets = {} # retrieve a socket from a player id 
        self.CM = CM

    # Works the same way as the socketio.on('message') function in main.py
    # Takes a message from a player and handles it accordingly
    def handleMessage(self, message: Message, player: Player):
        msgType = message.msgType
        match msgType:
            case "READY":
                player.ready = not player.ready
                self.CM.send_to_all_in_lobby(self.id, Message(MessageType.LOBBY_STATE, self.getLobbyState()))

            case "START_GAME":
                if self.gameCanStart():
                    self.startGame()
                    first_word = self.game.curWord
                    self.CM.send_to_all_in_lobby(self.id, Message(MessageType.GAME_STARTED, {"firstStartingWord": first_word}))
                    self.CM.send_to_all_in_lobby(self.id, Message(MessageType.LOBBY_STATE, self.getLobbyState()))
                else:
                    self.CM.send_to_player(player, Message(MessageType.GAME_CANNOT_START, {}))

            case "SUBMIT_WORD":
                if self.game is not None:
                    retCode = self.game.processPlayerSubmission(player, message.msgData['word'])

                    # retCode == -1 means error occurred (they already submitted a word this turn)
                    if retCode == -1:
                        self.CM.send_to_player(player, Message(MessageType.INVALID_SUBMISSION, {}))

                    # retCode == -2 means error occurred (they submitted a word someone else had already submitted)
                    elif retCode == -2:
                        self.CM.send_to_player(player, Message(MessageType.DUPLICATE_WORD, {}))

                    # retcode == 1 means the submission was processed just fine 
                    else:
                        self.CM.send_to_all_in_lobby(self.id, Message(MessageType.WORD_SUBMITTED, {"playerID": player.id}))
                        if self.game.everyoneHasSubmitted():
                            self.game.evaluateSubmissions()
                        self.CM.send_to_all_in_lobby(self.id, Message(MessageType.LOBBY_STATE, self.getLobbyState()))
                else: # if there is no game and a word was submitted somehow
                    warnings.warn(colored(f"Game has not started for lobby {self.id}. Not handling request.", 'yellow'))

            #URL messages get sent whenever we get to the Lobby page. If they joined via the join/create lobby buttons, the message will be routed here, as their ID will have already been assigned
            # Basically, it means we don't need to do anything with the message, so just drop it.
            case "URL": 
                pass
            case "USERNAME":
                player.username = message.msgData['data']
                self.CM.send_to_all_in_lobby(self.id, Message(MessageType.LOBBY_STATE, self.getLobbyState()))
            case "RANDOMIZE_BIGHEAD":
                player.randomizeBigHead()
                self.CM.send_to_all_in_lobby(self.id, Message(MessageType.LOBBY_STATE, self.getLobbyState()))
            case _:
                raise Exception(f'Invalid message type. A type of {msgType} was received by lobby {self.id}, but no corresponding function exists')
    
    def endGame(self):
        self.game = None
        self.CM.send_to_all_in_lobby(self.id, Message(MessageType.GAME_ENDED, {}))
        self.CM.send_to_all_in_lobby(self.id, Message(MessageType.RESULTS, {"scores": self.game.scores}))
        # Maybe start 30 to 60 sec timer for people to view scores, and then everyone gets kicked out afterwards?

    # should be called after the timer expires so players get kicked out of the lobby and it can be closed 
    def kickOutPlayers(self):
        self.CM.send_to_all_in_lobby(self.id, Message(MessageType.LOBBY_CLOSING, {}))


    def addPlayer(self, player):
        self.players.append(player)
        self.playerIDs.add(player.id)


    def removePlayer(self, player):
        id = player.id
        self.players.remove(player)
        self.playerIDs.remove(id)

    def isEmpty(self) -> bool:
        return len(self.players) == 0

    def size(self) -> int:
        return len(self.players)


    # If there are 2 or more players and they're all ready, game can start
    def gameCanStart(self):
        return len(self.players) >= 2 and all([player.ready for player in self.players])


    def startGame(self):
        self.game = Game(self.players, 5, self.CM, self)

    def getLobbyState(self) -> dict:
        return {
            "lobbyID": self.id,
            "startingWord": self.game.curWord if self.game is not None else "N/A",
            "players": [player.toJSON() for player in self.players],
            "gameStarted": self.game is not None,
            "turnNumber": self.game.turn if self.game is not None else "N/A"
        }


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
            self.IDsInUse.append(newID)
            return newID
