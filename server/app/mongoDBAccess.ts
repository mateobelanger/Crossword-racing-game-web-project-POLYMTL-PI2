import { Response } from "express";
import { EventEmitter } from "events"

// mLab account:
// username: arault@outlook.com
// password: *x-qGMlC1vwh

// Connection URL
const userName: string = "admin";
const password: string = "admin";
// Database Name
const dbName = "log2990-equipe4";
const MONGODB_URI: string = "mongodb://" + userName + ":" + password + "@ds115436.mlab.com:15436/" + dbName;
 


const MONGOOSE: any = require('mongoose');



export class MongoDBAccess {
    

    public constructor() {
        
        // connection.on('error', console.error.bind(console, 'connection error:'));
    }

    public helloWorld(res: Response): void {

        res.send("Hello World");
    }

    public testConnection(res: Response): void {
        MONGOOSE.connect(MONGODB_URI);
        let connection: any = MONGOOSE.connection;
        connection.once("open", () => res.send("test"));
        
    }


    public testElement(res: Response): void {
        
        MONGOOSE.connect(MONGODB_URI);
        let connection: any = MONGOOSE.connection;
        
        let trackSchema = MONGOOSE.Schema({
            name: String
        });

        let Track = MONGOOSE.model("Track", trackSchema);
        let track1 = new Track({ name: "Our first track!!" });

        connection.once("open", () => 
            track1.save( (err, track1) => {
                    if (err) return console.error(err);
                    res.send("test2");
                })
        );
        
    }
 
}
