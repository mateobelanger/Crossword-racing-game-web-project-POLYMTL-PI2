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

export const W_KEYCODE: number = 87;
export const A_KEYCODE: number = 65;
export const S_KEYCODE: number = 83;
export const D_KEYCODE: number = 68;
export const C_KEYCODE: number = 67;
export const N_KEYCODE: number = 78;
export const E_KEYCODE: number = 69;
export const PLUS_KEYCODE: number = 187;
export const MINUS_KEYCODE: number = 189;