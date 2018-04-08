import { Difficulty } from "../constants";
import { GridWord } from '../../common/crosswordsInterfaces/word';



export class GameConfiguration  {
    public roomId: string;
    public hostId: string;
    public guestId: string;

    public hostUsername: string;
    public difficulty: Difficulty;
    public _words: GridWord[];
    public hostValidatedWords: GridWord[];
    public guestValidatedwords: GridWord[];

    constructor(roomId: string, hostId: string, hostUsername: string, difficulty: Difficulty, words: GridWord[]) {
        this.roomId = roomId;        
        this.hostId = hostId;
        this.guestId = null;
        this.hostUsername = hostUsername;
        this.difficulty = difficulty;
        this._words = words;
        this.guestValidatedwords = [];
        this.hostValidatedWords = [];
    }

    public isInGame(id: string): boolean {
        return this.hostId === id || this.guestId === id;
    }

    public isHost(id: string): boolean {
        return this.hostId === id;
    }

    // public set words(words: GridWord[]) {
    //     this._words = words;
    // }

    // TODO: les getters ne fonctionnent pas
    // public get roomId(): string {
    //     return this._roomId;
    // }

    // public get hostUsername(): string {
    //     return this._hostUsername;
    // }

    // public get difficulty(): string {
    //     return this._difficulty;
    // }
}
