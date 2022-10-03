from Lobby import Lobby 

def handleUsernameMsg(msg):
    pass

def handlePlayerJoinMsg(msg):
    pass

def handleCreateLobbyMsg(msg, lobbyCreator, sidToPlayer, sid, lobbies, newID):
    if lobbyCreator == None:
        print("Unknown socket tried to create lobby. No player associated with the socket. Not handling request.")
        return

    lobby = Lobby(newID)
    lobbies.append(Lobby(newID))
    sidToPlayer[sid].lobbyID = lobby.id
    print("Created new lobby with ID: ", newID)
    

def handleLobbyStateMsg(msg):
    pass

def handleInGameRequest(msg, sendingPlayer, socketToPlayers, sid, lobbies):
    pass

def sendToPlayer(playerSocket, msg):
    pass

def sendToAllInLobby(lobby, msg):
    pass