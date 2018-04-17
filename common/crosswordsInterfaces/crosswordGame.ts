import { Difficulty } from "../constants";
import { GridWord } from '../../common/crosswordsInterfaces/word';

enum PlayerType {HOST, GUEST}

export class CrosswordGame  {
    public roomId: string;
    public ids: string[];
    public usernames: string[];
    public difficulty: Difficulty;
    public _words: GridWord[];
    public validatedWords: GridWord[][];
    public isWaitingForRestart: boolean[]; 

    constructor(roomId: string,
                hostId: string, 
                hostUsername: string, 
                difficulty: Difficulty, 
                words: GridWord[]) {
                    
        this.roomId = roomId;

        this.ids = [];
        this.hostId = hostId;
        this.guestId = null;
        
        this.usernames = [];
        this.hostUsername = hostUsername;
        this.guestUsername = "";
    
        this.isWaitingForRestart = [false, false]; 

        this.difficulty = difficulty;
        this._words = words;

        this.validatedWords = [];
        this.guestValidatedWords = [];
        this.hostValidatedWords = [];
    }

    public isInGame(id: string): boolean {
        return this.roomId === id || this.hostId === id || this.guestId === id;
    }

    public isHost(id: string): boolean {
        return this.hostId === id;
    }

    public get hostId(): string {
        return this.ids[PlayerType.HOST];
    }

    public set hostId(hostId: string) {
        this.ids[PlayerType.HOST] = hostId;
    }

    public get guestId(): string {
        return this.ids[PlayerType.GUEST];
    }

    public set guestId(guestId: string) {
        this.ids[PlayerType.GUEST] = guestId;
    }

    // TODO: Ces getters ne fonctionnent pas
    public get hostUsername(): string {
        return this.usernames[PlayerType.HOST];
    }

    public set hostUsername(hostUsername: string) {
        this.usernames[PlayerType.HOST] = hostUsername;
    }

    // TODO: Ces getters ne fonctionnent pas    
    public get guestUsername(): string {
        return this.usernames[PlayerType.GUEST];
    }

    public set guestUsername(guestUsername: string) {
        this.usernames[PlayerType.GUEST] = guestUsername;
    }

    public get hostValidatedWords(): GridWord[] {
        return this.validatedWords[PlayerType.HOST];
    }

    public set hostValidatedWords(hostValidatedWords: GridWord[]) {
        this.validatedWords[PlayerType.HOST] = hostValidatedWords;
    }

    public get guestValidatedWords(): GridWord[] {
        return this.validatedWords[PlayerType.GUEST];
    }

    public set guestValidatedWords(guestValidatedWords: GridWord[]) {
        this.validatedWords[PlayerType.GUEST] = guestValidatedWords;
    }

    public isMultiplayer(): boolean {
        return this.usernames[1].length !== 0; 
    }

    public updateGuestInformation(socketId: string, guestName: string): void {
        this.guestId = socketId;
        this.guestUsername = guestName;
    }

    public areAllWordsValidated(): boolean { 
        return this.guestValidatedWords.length + this.hostValidatedWords.length >= this._words.length; 
    } 

    public restartGame(): void { 
        this.validatedWords = []; 
        this.guestValidatedWords = []; 
        this.hostValidatedWords = []; 
        this._words = []; 
    } 

    public isAPlayerWaitingForRestart(): boolean {
        return this.isWaitingForRestart[PlayerType.HOST] || this.isWaitingForRestart[PlayerType.GUEST];
    }
}
