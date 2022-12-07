let MessageType = {
  CREATE_LOBBY: "CREATE_LOBBY",
  PLAYER_JOIN: "PLAYER_JOIN",
  READY: "READY",
  START_GAME: "START_GAME",
  SUBMIT_WORD: "SUBMIT_WORD",
  GAME_STATE: "GAME_STATE",
  GAME_ENDED: "GAME_ENDED",
  USERNAME: "USERNAME",
  URL: "URL",
  LOBBY_DOESNT_EXIST: "LOBBY_DOESNT_EXIST",
  LOBBY_CLOSING: "LOBBY_CLOSING",
  TIME_OVER: "TIME_OVER"
  //insert more types as needed, make sure one exists on backend too
};

export default MessageType;
