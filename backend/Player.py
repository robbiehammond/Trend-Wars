class Player:
    def __init__(self, id, username, ready):
        self.id = id
        self.lobbyID = None
        self.username = username
        self.ready = ready
        self.guessedWord = None # will be overrided with their guessed word during the game 
        self.score = 0
        self.bestWord = ""
        self.mostPointsFromWord = -1

    # encode a player (in json) to be sent to frontend
    # also not sure if we'll ever need this 
    def toJSON(self):
        return {
            "id": self.id,
            "username": self.username,
            "ready": self.ready,
            "score": int(self.score),
            "wordSubmittedThisTurn": False if self.guessedWord == None else True,
            "bestWord": self.bestWord
        }

    def __str__(self):
        return f'Player: {self.id}, {self.username}, {self.ready}'

    # decode a player object sent to the server via json into a Player object
    # not sure if we'll ever need to use use this
    @staticmethod
    def fromJSON(json):
        pass