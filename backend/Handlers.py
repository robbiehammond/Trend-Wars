from Lobby import Lobby 
from Player import Player 
from Message import MessageType, Message
import ConnectionManager
import warnings
from termcolor import colored

warnings.simplefilter('always', UserWarning)

def handleUsernameMsg(player: Player, username: str, CM: ConnectionManager):
    player.username = username
    CM.send_to_player(player, Message(MessageType.PLAYER_STATE, player.toJSON()))
    CM.send_to_player(player, Message(MessageType.USERNAME_CHANGED, {"username": player.username})) 


def handlePlayerJoinMsg(player, CM: ConnectionManager, lobbies, lobbyID):
    if player.lobbyID is not None:
        warnings.warn(colored("Player already in a lobby. Not handling request.", "yellow"))
    else:
        for lobby in lobbies:
            if lobby.id == lobbyID:
                lobby.addPlayer(player)
                player.lobbyID = lobby.id
                if player.username == '?':
                    player.username = 'Player ' + str(lobby.size())
                CM.send_to_player(player, Message(MessageType.LOBBY_JOINED, {"lobbyID": lobby.id, "lobby_state": lobby.getLobbyState()}))
                CM.send_to_all_in_lobby(lobbyID, Message(MessageType.LOBBY_STATE, lobby.getLobbyState()))
                return
        CM.send_to_player(player, Message(MessageType.LOBBY_DOESNT_EXIST, {'data': 'bruh moment'}))
        warnings.warn(f"No lobby with ID {lobbyID} exists. Not handling request.")

def handleCreateLobbyMsg(msg, lobbyCreator, sidToPlayer, sid, lobbies, newID, CM):
    if lobbyCreator == None:
        warnings.warn(colored("Unknown socket tried to create lobby. No player associated with the socket. Not handling request.", "yellow"))
        return

    lobby = Lobby(newID, CM)
    lobbies.append(lobby)
    player = sidToPlayer[sid]
    lobby.addPlayer(player)
    player.lobbyID = lobby.id
    if player.username == '?':
        print("here")
        player.username = 'Player ' + str(lobby.size())
    CM.send_to_player(player, Message(MessageType.LOBBY_CREATED, {"lobbyID": lobby.id, "lobby_state": lobby.getLobbyState()})) # Seems like frontend isn't set up such that the page changes if this isn't sent
    CM.send_to_all_in_lobby(lobby.id, Message(MessageType.LOBBY_STATE, lobby.getLobbyState()))