from enum import Enum, auto

#I'm sure we'll need more message types, but this is a start
class MessageType(Enum):
    USERNAME = auto()
    READY = auto()
    PLAYER_JOIN = auto()
    PLAYER_LEAVE = auto()
    CREATE_LOBBY = auto()
    LOBBY_STATE = auto()
    START_GAME = auto()
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