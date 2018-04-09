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
    DISCONNECTED = "disconnected",
    CREATE_GAME = "createGame",
    CREATE_SOLO_GAME = "create solo game",
    JOIN_GAME = "joinGame",
    GET_GAME_LOBBIES = "getGameLobbies",
    ADD_VALIDATED_WORD = "addValidatedWord",
    SELECT_WORD = "selectWord",
    DISCONNECT = "disconnect",
    CONNECTION = "connection"
}