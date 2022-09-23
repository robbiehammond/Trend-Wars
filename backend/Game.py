class Game:
    def __init__(self, players, maxTurns):
        # also need to implement a turn timer at some point so turns don't just end when everyone submits
        self.players = players
        self.turn = 0
        self.curWord = ""
        self.scores = {} # map each player to their score
        self.wordSubmissions = {} # map each player to their submitted word. Is cleared and re-populated every turn
        self.maxTurns = maxTurns
        self.gameEnded = False

        # initialize all player scores to 0
        for player in players:
            self.scores[player] = 0


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
    def processPlayerSubmission(self, player, submission):
        self.wordSubmissions[player] = submission

        # if all players have submitted, evaluate the submissions 
        if len(self.wordSubmissions) == len(self.players):
            self.evaluateSubmissions()
        

    # Once all players have submitted a word, submit to the Trends API and update scores accordingly 
    def evaluateSubmissions(self):
        for player, submission in self.wordSubmissions.items():
            self.scores[player] += len(submission) # not at all how we want to calculate scores, but just for testing purposes
            # call API, see how their word + starting word did 
            # rank players accordingly, update score
        self.endTurn()


    def endTurn(self):
        self.startNewTurn()
        if self.turn == self.maxTurns:
            self.endGame()


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
        return f'Game: last completed turn: {self.turn}, current starting word: {self.curWord}, current scores: {self.scores}'


