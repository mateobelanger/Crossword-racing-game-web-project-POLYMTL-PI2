import { Difficulty } from "../constants";


export class GameConfiguration  {
    roomId: number;
    hostUsername: string;
    difficulty: string;

    constructor(roomId: number, hostUsername: string, difficulty: Difficulty) {
        this.roomId = roomId;
        this.hostUsername = hostUsername;
        this.difficulty = difficulty;
    }
}
