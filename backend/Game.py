class Game:
    def __init__(self, players, maxTurns):
        self.players = players
        self.turn = 0
        self.curWord = ""
        self.scores = {} # map each player to their score
        self.wordSubmissions = {} # map each player to their submitted word. Is cleared and re-populated every turn
        self.maxTurns = maxTurns

        # initialize all player scores to 0
        for player in players:
            self.scores[player] = 0

    # clear previous submissions and generate new starting word at the beginning of each turn
    def startNewTurn(self):
        if self.turn > self.maxTurns:
            self.endGame()
            return

        self.wordSubmissions = {}
        self.generateStartingWord()
        # certainly will need more logic here


    # choose a word for players to complete
    def generateStartingWord(self) -> str:
        pass

    # when a player submits a word in a given turn, remember it 
    def processPlayerSubmission(self, player, submission):
        self.wordSubmissions[player] = submission
        

    # Once all players have submitted a word, submit to the Trends API and update scores accordingly 
    def evaluateSubmissions(self):
        for player, submission in self.wordSubmissions.items():
            # call API, see how their word + starting word did 
            # rank players accordingly, update score
            pass

    # show everyone player's scores at the end of the game 
    def showScores(self):
        pass


    def endGame(self):
        self.showScores()
        pass




