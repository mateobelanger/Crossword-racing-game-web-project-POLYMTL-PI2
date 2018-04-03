import * as http from "http";
// import { injectable } from "inversify";
import * as SocketIo from "socket.io";

// @injectable()
export class Io {

    private socketServer: SocketIO.Server;
    // private rooms: number[];

    constructor(server: http.Server) {
        // this.rooms = [];
        // server.listen(this.appPort);
        this.socketServer = SocketIo(server);

        this.socketServer.on("connection", (socket: SocketIO.Socket) => {
            console.log("nouvelle connection");
            socket.on("connect", (username: string) => { console.log("wouhou"); });

            socket.on("join", () => { console.log("wouhou"); });

            socket.on("msg", () => { console.log("wouhou"); });
        });

     }
}
