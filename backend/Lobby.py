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
                    self.CM.send_to_all_in_lobby(self.id, Message(MessageType.GAME_STARTED, {}))
                    self.CM.send_to_all_in_lobby(self.id, Message(MessageType.STARTING_WORD, {'word': first_word}))
                else:
                    self.CM.send_to_player(player, Message(MessageType.GAME_CANNOT_START, {}))

            case "SUBMIT_WORD":
                if self.game is not None:
                    self.game.processPlayerSubmission(player, message.msgData['word'])
                    self.CM.send_to_all_in_lobby(self.id, Message(MessageType.WORD_SUBMITTED, {"playerID": player.id}))
                    if self.game.everyoneHasSubmitted():
                        self.game.evaluateSubmissions()
                        submittedWords = self.game.getSubmittedWords()
                        respectivePoints = self.game.getPointsForTheirWord()
                        for player in self.players: # send to everyone in the lobby the username, word, point value, and updated score for each player
                            added_points = int(respectivePoints[player])
                            word = submittedWords[player]
                            new_score = int(self.game.getPlayerScore(player))
                            # self.CM.send_to_all_in_lobby(self.id, Message(MessageType.SCORE, {"username": player.username, "added_points": added_points, "word": word, "new_score": new_score}))
                    self.CM.send_to_all_in_lobby(self.id, Message(MessageType.LOBBY_STATE, self.getLobbyState()))
                else: # if there is no game and a word was submitted somehow
                    warnings.warn(colored(f"Game has not started for lobby {self.id}. Not handling request.", 'yellow'))


            case "READY_FOR_NEXT_ROUND":
                if not self.game.everyoneHasSubmitted():
                    warnings.warn(colored("Someone readied up for the next round, even though not everyone has submitted. Something wrong is happening here that needs to be fixed."), 'yellow')
                    return
                self.game.processReadyForNextRound(player)
                self.CM.send_to_all_in_lobby(Message(MessageType.READY_FOR_NEXT_ROUND, {"playerID": player.id}), self.id)
                if self.game.allReadyForNextTurn():
                    if self.game.gameShouldEnd():
                        self.endGame()
                    else:
                        self.game.startNewTurn()
                        new_word = self.game.curWord
                        self.CM.send_to_all_in_lobby(self.id, Message(MessageType.NEW_TURN, {'turn_number': self.game.turn}))
                        self.CM.send_to_all_in_lobby(self.id, Message(MessageType.STARTING_WORD, {'word': new_word}))
                        self.CM.send_message_to_all(self.id, Message(MessageType.LOBBY_STATE, self.getLobbyState())) #probably doesn't needed to be sent, but rather have too many than too little messages sent


            #URL messages get sent whenever we get to the Lobby page. If they joined via the join/create lobby buttons, the message will be routed here, as their ID will have already been assigned
            # Basically, it means we don't need to do anything with the message, so just drop it.
            case "URL": 
                pass
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


    # If there are 2 or more players and they're all ready, game can start
    def gameCanStart(self):
        return len(self.players) >= 2 and all([player.ready for player in self.players])


    def startGame(self):
        self.game = Game(self.players, 5)

    def getLobbyState(self) -> dict:
        return {
            "lobbyID": self.id,
            "players": [player.toJSON() for player in self.players],
            "gameStarted": self.game is not None,
            "turnNumber": self.game.turn if self.game is not None else "N/A"
        }

    # for debugging purposes 
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
            self.IDsInUse.append(newID)
            return newID
