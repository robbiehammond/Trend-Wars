from enum import Enum, auto

#I'm sure we'll need more message types, but this is a start
class MessageType(Enum):
    USERNAME = auto() # submitted to the server to register a player's username 
    READY = auto() # used to denote that a player is ready for the game to start 
    PLAYER_JOIN = auto() # used to notify the server that a player has joined a lobby
    PLAYER_LEAVE = auto() # used to notify the server that a player has left a lobby
    CREATE_LOBBY = auto() # used to notify the server that a lobby was requested to be created
    LOBBY_CREATED = auto() # used to notify the player that their CREATE_LOBBY request was successful
    LOBBY_STATE = auto() 
    START_GAME = auto()
    GAME_STARTED = auto() # used to notify the players that the game has started 
    SUBMIT_WORD = auto()
    READY_FOR_NEXT_ROUND = auto()

    # returns string value of json 
    def __str__(self):
        return format(self.name)

class Message:
    # A message requires 
    #   - it's type (which can be used to determine what to do with the message, like create a lobby, send the current word to players, etc) 
    #   - the data (which contains the actual information)
    def __init__(self, msgType: MessageType, msgData: dict):
        self.msgType = msgType
        self.msgData = msgData

    #encode a message (in json) to be sent to frontend
    def toJSON(self):
        return {
            "type": str(self.msgType),
            "data": self.msgData
        }

    #decode a message sent from frontend into a Message object
    @staticmethod
    def fromJSON(json):
        return Message(json['type'], json['data'])