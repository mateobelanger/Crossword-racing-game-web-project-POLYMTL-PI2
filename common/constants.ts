export const GRID_SIZE: number = 10;

export enum Difficulty {
    EASY = "easy",
    NORMAL = "normal",
    HARD = "hard"
}

export enum PlayerType { HOST, GUEST }

export const BLACK_CELL: string = "-";

export enum SocketMessage {

    DISCONNECTED = "disconnected",
    DISCONNECT = "disconnect",
    CONNECTION = "connection",

    CREATE_GAME = "create game",
    CREATE_SOLO_GAME = "create solo game",
    INITIALIZE_GAME = "initialize game",
    JOIN_GAME = "join game",
    SENT_GAME_AFTER_JOIN = "sent game after join",

    HOST_RESTART_PENDING = "host restart pending",
    GUEST_RESTART_PENDING = "guest restart pending",
    HOST_ASKED_FOR_RESTART = "host asked for restart",
    GUEST_ASKED_FOR_RESTART = "guest asked for restart",
    OPPONENT_DISCONNECTED_WHILE_WAITING = "opponent disconnected while waiting",
    OPPONENT_DISCONNECTED = "opponent disconnected",

    GET_GAME_LOBBIES = "get game lobbies",
    GAME_LOBBIES = "game lobbies",

    ADD_VALIDATED_WORD = "add validated word",
    UPDATE_VALIDATED_WORD = "update validated word",

    REMOTE_SELECTED_WORD = "remote selected word",
    REMOTE_DESELECTED_WORD = "remote deselected word",
    SELECT_WORD = "select word",
    DESELECT_WORD = "deselect word",

    GAME_FINISHED = "game finished"
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
