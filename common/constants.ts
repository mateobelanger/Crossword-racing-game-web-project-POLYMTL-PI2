export const GRID_SIZE: number = 10;

export enum Difficulty {
    EASY = "easy",
    NORMAL = "normal",
    HARD = "hard"
}

export enum PlayerType { HOST, GUEST };
export enum GameState { NO_GAME, WAITING_FOR_OPPONENT, ONGOING, WON, LOST };

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
    OPPONENT_DISCONNECTED = "opponent disconnected",

    GET_GAME_LOBBIES = "get game lobbies",
    GAME_LOBBIES = "game lobbies",
    
    ADD_VALIDATED_WORD = "add validated word",
    UPDATE_VALIDATED_WORD = "update validated word",
    
    REMOTE_SELECTED_WORD = "remote selected word",
    REMOTE_DESELECTED_WORD = "remote deselected word",
    SELECT_WORD = "select word",
    DESELECT_WORD = "deselect word",

    GAME_FINISHED = "game finished",
}