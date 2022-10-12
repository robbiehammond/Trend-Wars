from Lobby import Lobby 
from Message import MessageType, Message
import ConnectionManager
import warnings

def handleUsernameMsg(msg):
    pass

def handlePlayerJoinMsg(player, CM: ConnectionManager, lobbies, lobbyID):
    if player.lobbyID is not None:
        warnings.warn("Player already in a lobby. Not handling request.")
    else:
        for lobby in lobbies:
            if lobby.id == lobbyID:
                lobby.addPlayer(player)
                player.lobbyID = lobby.id
                CM.send_to_player(player, Message(MessageType.LOBBY_JOINED, {"lobbyID": lobby.id}))
                CM.send_to_lobby(lobbyID, Message(MessageType.LOBBY_STATE, lobby.getLobbyState()))
    pass

def handleCreateLobbyMsg(msg, lobbyCreator, sidToPlayer, sid, lobbies, newID, CM):
    if lobbyCreator == None:
        print("Unknown socket tried to create lobby. No player associated with the socket. Not handling request.")
        return

    lobby = Lobby(newID, CM)
    lobbies.append(lobby)
    player = sidToPlayer[sid]
    lobby.addPlayer(player)
    player.lobbyID = lobby.id
    print("Created new lobby with ID: ", newID)
    CM.send_to_player(player, Message(MessageType.LOBBY_CREATED, {"lobbyID": lobby.id}))