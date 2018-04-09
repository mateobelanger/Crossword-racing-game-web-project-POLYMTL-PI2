import { Difficulty } from "../constants";
import { GridWord } from '../../common/crosswordsInterfaces/word';



export class GameConfiguration  {
    public roomId: string;
    public ids: string[];
    public usernames: string[];
    public difficulty: Difficulty;
    public _words: GridWord[];
    public validatedWords: GridWord[][];

    constructor(roomId: string, hostId: string, hostUsername: string, difficulty: Difficulty, words: GridWord[]) {
        this.roomId = roomId;

        this.ids = [];
        this.hostId = hostId;
        this.guestId = null;
        
        this.usernames = [];
        this.hostUsername = hostUsername;
        this.guestUsername = "";

        this.difficulty = difficulty;
        this._words = words;

        this.validatedWords = [];
        this.guestValidatedWords = [];
        this.hostValidatedWords = [];
    }

    public isInGame(id: string): boolean {
        return this.hostId === id || this.guestId === id;
    }

    public isHost(id: string): boolean {
        return this.hostId === id;
    }

    public get hostId(): string {
        return this.ids[0];
    }

    public set hostId(hostId: string) {
        this.ids[0] = hostId;
    }

    public get guestId(): string {
        return this.ids[1];
    }

    public set guestId(guestId: string) {
        this.ids[1] = guestId;
    }

    public get hostUsername(): string {
        return this.usernames[0];
    }

    public set hostUsername(hostUsername: string) {
        this.usernames[0] = hostUsername;
    }

    public get guestUsername(): string {
        return this.usernames[1];
    }

    public set guestUsername(guestUsername: string) {
        this.usernames[1] = guestUsername;
    }

    public get hostValidatedWords(): GridWord[] {
        return this.validatedWords[0];
    }

    public set hostValidatedWords(hostValidatedWords: GridWord[]) {
        this.validatedWords[0] = hostValidatedWords;
    }

    public get guestValidatedWords(): GridWord[] {
        return this.validatedWords[1];
    }

    public set guestValidatedWords(guestValidatedWords: GridWord[]) {
        this.validatedWords[1] = guestValidatedWords;
    }

    public updateGuestInformation(socketId: string, guestName: string): void {
        this.guestId = socketId;
        this.guestUsername = guestName;
    }
}
