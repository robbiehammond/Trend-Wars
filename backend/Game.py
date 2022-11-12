import warnings

import ConnectionManager
import time
from Player import Player
from google_connector import google_connector
from termcolor import colored

class Game:
    def __init__(self, players, maxTurns):
        # also need to implement a turn timer at some point so turns don't just end when everyone submits
        self.players = players
        self.turn = 0
        self.curWord = ""
        self.scores = {} # map each player to their score
        self.wordSubmissions = {} # map each player to their submitted word. Is cleared and re-populated every turn
        self.maxTurns = maxTurns
        self.readyForNextTurn = {} # Once the game has started, all players start as ready
        self.gameEnded = False
        self.timer = 10
        #dictionary to hold the ranks of each player
        self.playerRank = {}
        # interesting game statistics that can be displayed at the end of the game
        self.stats = {
            'best-word': 'N/A',
            'worst-word': 'N/A',
        }

        #self.countdown = countdown
        #values hardcoded in, can implement so that users can configure values here.
        self.connector = google_connector(connect_region = 'en-US', search_region = 'US', timeframe = 'today 12-m', gprop = '')

        # initialize all player scores to 0 and set all players as not ready for next turn
        #intializes player ranks to 0
        for player in players:
            self.scores[player] = 0
            self.readyForNextTurn[player.id] = False
            self.playerRank[player] = 0

        self.startNewTurn()

    def getPointsForTheirWord(self):
        return self.pointsForTheirWord

    def getPlayerScore(self, player: Player):
        return self.scores[player]

    # clear previous submissions and generate new starting word at the beginning of each turn
    def startNewTurn(self):
        self.turn += 1
        self.curWord = self.generateStartingWord()
        self.pointsForTheirWord = {}
        self.wordSubmissions = {}
        # self.turnTimer(10)
        # certainly will need more logic here


    # choose a word for players to complete
    def generateStartingWord(self) -> str:
        return "testword"


    # when a player submits a word in a given turn, remember it 
    def processPlayerSubmission(self, player: Player, submission: str):
        if self.wordSubmissions.get(player) is not None:
            warnings.warn(colored(f'Player {player.id} has already submitted a word for this turn. Their previous submission was {self.wordSubmissions[player]} and their new submission is {submission}. The new submission will be ignored.', 'yellow'))
            return
        self.wordSubmissions[player] = submission
        

    # Once all players have submitted a word, submit to the Trends API and update scores accordingly 
    def evaluateSubmissions(self):
        #right now, the command returns the "max" search value of the input words
        results = self.connector.get_word_results(self.wordSubmissions.values()).max()
        for player, submission in self.wordSubmissions.items():
            self.scores[player] += results[submission]
            player.score = self.scores[player] # redundant, eventually we should switch over to exclusively using the score field rather than the map
            self.pointsForTheirWord[player] = results[submission]

        #found this on StackOverflow, we will see if this works later 
        self.playerRank = {key: rank for rank, key in enumerate(sorted(self.scores, key=self.scores.get, reverse=True), 1)}
        self.endTurn()

    # After all players have submitted their words and they've been submitted to the Trends API, alert those in the lobby on how everyone did
    def getSubmittedWords(self):
        return self.wordSubmissions

    # if all players have submitted, evaluate the submissions 
    # send messsage to everyone connected to this lobby that this player has submitted a word
    def everyoneHasSubmitted(self):
        return len(self.wordSubmissions) == len(self.players)

    
    def turnTimer(self):
        while self:
            mins, secs = divmod(self, 60)
            timeformat = '{:02d}:{:02d}'.format(mins, secs)
            print(timeformat, end='\r')
            time.sleep(1)
            self -= 1
            if (self == 0):
                print("Time's up")

    def gameShouldEnd(self):
        return self.turn == self.maxTurns

    def endTurn(self):
        for player in self.players:
            self.readyForNextTurn[player.id] = False


    def processReadyForNextRound(self, player: Player):
        if self.wordSubmissions.get(player) is None:
            warnings.warn(colored(f'Player {player.id} has read ied up for the next round, but has not submitted a word for the current round. This request will be ignored.', 'yellow'))
            return
        self.readyForNextTurn[player.id] = True
        if (self.allReadyForNextTurn()):
            self.startNewTurn()

    def allReadyForNextTurn(self):
        for player, status in self.readyForNextTurn.items():
            if not status:
                return False
        return True

    def setGameOver(self):
        self.gameEnded = True 


    def __str__(self):
        return f'Game: Current Turn: {self.turn}, current starting word: {self.curWord}, current scores: {self.scores}'
