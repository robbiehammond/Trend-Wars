

class Player:
    def __init__(self, id, username, ready):
        self.id = id
        self.username = username
        self.ready = ready

    # encode a player (in json) to be sent to frontend
    # also not sure if we'll ever need this 
    def toJSON(self):
        return {
            "id": self.id,
            "username": self.username,
            "ready": self.ready
        }

    # decode a player object sent to the server via json into a Player object
    # not sure if we'll ever need to use use this
    @staticmethod
    def fromJSON(json):
        pass