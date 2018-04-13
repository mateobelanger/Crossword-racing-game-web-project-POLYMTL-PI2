export const GRID_SIZE: number = 10;

export enum Difficulty {
    EASY = "easy",
    NORMAL = "normal",
    HARD = "hard"
}

export const BLACK_CELL: string = "-";

export enum SocketMessage {
    GAME_LOBBIES = "gameLobbies",
    GRID_FROM_JOIN = "gridFromJoin",
    UPDATE_VALIDATED_WORD = "updateValidatedWord",
    INITIALIZE_GAME = "initializeGame",
    REMOTE_SELECTED_WORD = "remoteSelectedWord",
    REMOTE_DESELECTED_WORD = "remoteDeselectedWord",
    DISCONNECTED = "disconnected",
    CREATE_GAME = "createGame",
    CREATE_SOLO_GAME = "create solo game",
    JOIN_GAME = "joinGame",
    HOST_RESTART_PENDING = "hostRestartPending", 
    GUEST_RESTART_PENDING = "guestRestartPending", 
    HOST_ASK_FOR_RESTART = "hostAskForRestart", 
    GUEST_ASK_FOR_RESTART = "guestAskForRestart", 
    GAME_FINISHED = "gameFinished", 
    GET_GAME_LOBBIES = "getGameLobbies",
    ADD_VALIDATED_WORD = "addValidatedWord",
    SELECT_WORD = "selectWord",
    DESELECT_WORD = "deselectWord",
    DISCONNECT = "disconnect",
    CONNECTION = "connection"
}