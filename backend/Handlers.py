from Lobby import Lobby 

def handleUsernameMsg(msg):
    pass

def handlePlayerJoinMsg(msg):
    pass

def handleCreateLobbyMsg(msg, sid, socketToPlayers, lobbies, newID):
    if sid not in socketToPlayers:
        print("Unknown socket tried to create lobby")
        return

    lobby = Lobby(newID)
    lobbies.append(Lobby(newID))
    socketToPlayers[sid].lobbyID = lobby.id
    print("Created new lobby with ID: ", newID)
    

def handleLobbyStateMsg(msg):
    pass
