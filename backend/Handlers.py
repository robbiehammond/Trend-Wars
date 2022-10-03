from Lobby import Lobby 
import warnings

def handleUsernameMsg(msg):
    pass

def handlePlayerJoinMsg(player, lobbyID):
    if player.lobbyID is not None:
        warnings.warn("Player already in a lobby. Not handling request.")
    else:
        player.lobbyID = lobbyID
    # probably want send some info back to frontend indicating that the player joined the lobby, send info about the lobby back
    pass

def handleCreateLobbyMsg(msg, lobbyCreator, sidToPlayer, sid, lobbies, newID):
    if lobbyCreator == None:
        print("Unknown socket tried to create lobby. No player associated with the socket. Not handling request.")
        return

    lobby = Lobby(newID)
    lobbies.append(Lobby(newID))
    sidToPlayer[sid].lobbyID = lobby.id
    print("Created new lobby with ID: ", newID)