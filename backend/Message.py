from enum import Enum, auto

#I'm sure we'll need more message types, but this is a start
class MessageType(Enum):
    PLAYER_ID = auto() # a client's ID is sent to client when they connect to the server
    USERNAME = auto() # submitted to the server to register a player's username (sent by client when they set their username )
    READY = auto() # used to denote that a player is ready for the game to start (sent by client when they ready up, and sent by server to alert connected clients that a player is ready)
    PLAYER_DATA = auto() # used to send all info regarding a player (username, id, ready status). A PLAYER_DATA message arriving on the frontend should indicate that this player needs to be rendered
    PLAYER_JOIN = auto() # used to notify the server that a player has joined a lobby (sent from client to server)
    LOBBY_JOINED = auto() # used to notify the client that they have successfully joined a lobby
    PLAYER_JOINED = auto() # used to notify the clients in a lobby that a player has joined
    PLAYER_LEAVE = auto() # used to notify the server that a player has left a lobby (client to server)
    CREATE_LOBBY = auto() # used to notify the server that a lobby was requested to be created (client to server)
    LOBBY_CREATED = auto() # used to notify the player that their CREATE_LOBBY request was successful (server to client)
    LOBBY_STATE = auto() # used to send all infor regarding the servers state (current word, time left, current players, etc) to clients. Just sent whenever a non-trivial amount of state changes.
    START_GAME = auto() # used to notify the server that a start game request was made
    GAME_STARTED = auto() # used to notify the players that the game has started 
    SUBMIT_WORD = auto() # used by the client to send a message to the serverA
    WORD_SUBMITTED = auto() # used to indicate to the client that a player has submitted a word
    READY_FOR_NEXT_ROUND = auto() # used to notify the server that a player is ready for the next round 

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