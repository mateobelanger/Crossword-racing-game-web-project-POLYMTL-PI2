import { Difficulty } from "../constants";
import { GridWord } from '../../common/crosswordsInterfaces/word';



export class GameConfiguration  {
    public roomId: string;      // hostId ??????????
    public guestId: string;    
    public hostUsername: string;
    public difficulty: string;
    public _words: GridWord[];

    constructor(roomId: string, hostUsername: string, difficulty: Difficulty, words: GridWord[]) {
        this.roomId = roomId;
        this.hostUsername = hostUsername;
        this.difficulty = difficulty;
        this._words = words;
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
