import warnings
import ConnectionManager
from Player import Player

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

        # initialize all player scores to 0 and set all players as not ready for next turn
        for player in players:
            self.scores[player] = 0
            self.readyForNextTurn[player.id] = False

        self.startNewTurn()


    # clear previous submissions and generate new starting word at the beginning of each turn
    def startNewTurn(self):
        self.turn += 1
        self.wordSubmissions = {}
        self.curWord = self.generateStartingWord()

        self.wordSubmissions = {}
        self.generateStartingWord()
        # certainly will need more logic here


    # choose a word for players to complete
    def generateStartingWord(self) -> str:
        return "balls"


    # when a player submits a word in a given turn, remember it 
    def processPlayerSubmission(self, player: Player, submission: str):
        if self.wordSubmissions.get(player) is not None:
            warnings.warn(f'Player {player.id} has already submitted a word for this turn. Their previous submission was {self.wordSubmissions[player]} and their new submission is {submission}. The new submission will be ignored.')
            return
        self.wordSubmissions[player] = submission
        

    # Once all players have submitted a word, submit to the Trends API and update scores accordingly 
    def evaluateSubmissions(self):
        for player, submission in self.wordSubmissions.items():
            self.scores[player] += len(submission) # not at all how we want to calculate scores, but just for testing purposes
            # call API, see how their word + starting word did 
            # rank players accordingly, update score
        self.endTurn()


    # if all players have submitted, evaluate the submissions 
    # send messsage to everyone connected to this lobby that this player has submitted a word
    def everyoneHasSubmitted(self):
        return len(self.wordSubmissions) == len(self.players)


    def endTurn(self):
        for player in self.players:
            self.readyForNextTurn[player.id] = False
        if self.turn == self.maxTurns:
            self.endGame()


    def processReadyForNextRound(self, player: Player):
        if self.wordSubmissions.get(player) is None:
            warnings.warn(f'Player {player.id} has readied up for the next round, but has not submitted a word for the current round. This request will be ignored.')
            return
        self.readyForNextTurn[player.id] = True
        if all(self.readyForNextTurn):
            self.startNewTurn()


    # show everyone player's scores at the end of the game 
    def showScores(self):
        for player, score in self.scores.items():
            print(f'player {player.id} scored {score} points')
        pass


    # do whatever we need to properly end the game: show scores, close the lobby + kick players out of the lobby, etc
    def endGame(self):
        self.gameEnded = True
        self.showScores()


    def __str__(self):
        return f'Game: Current Turn: {self.turn}, current starting word: {self.curWord}, current scores: {self.scores}'
