import { Injectable } from '@angular/core';
import * as io from "socket.io-client";

@Injectable()
export class SocketService {

    private socket: SocketIOClient.Socket;

    public constructor() {
        this.socket = io.connect("http://localhost:3000");
    }

    public connectToGame(username: string): void {
        this.socket.emit("connect", username);
    }

}
