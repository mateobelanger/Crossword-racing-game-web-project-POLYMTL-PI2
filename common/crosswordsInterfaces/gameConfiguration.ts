import { Difficulty } from "../constants";


export class GameConfiguration  {
    roomId: string;
    hostUsername: string;
    difficulty: string;

    constructor(roomId: string, hostUsername: string, difficulty: Difficulty) {
        this.roomId = roomId;
        this.hostUsername = hostUsername;
        this.difficulty = difficulty;
    }
}
