import { Request, Response } from "express";
// import {} from "./schemas/trackSchema";

// mLab account:
// username: arault@outlook.com
// password: *x-qGMlC1vwh

// Connection URL
const userName: string = "admin";
const password: string = "admin";
const dbName = "log2990-equipe4";
const MONGODB_URI: string = "mongodb://" + userName + ":" + password + "@ds115436.mlab.com:15436/" + dbName;
// let Track = require("./schemas/Track.model"); 

const MONGOOSE: any = require('mongoose');


const trackSchema = MONGOOSE.Schema({
    name: String,
    description: String,
    timesPlayed: Number,
    bestTimes:[[String, Number]],
    waypoints:[[Number, Number, Number]]
});

const Track = MONGOOSE.model("Track", trackSchema);



export class MongoDBAccess {
    

    public constructor() { }
 
    // to do: change it according to req.body
    static addTrack(req: Request, res: Response): void {
        
        MONGOOSE.connect(MONGODB_URI);
        let connection: any = MONGOOSE.connection;

        let track = new Track({
            // name: req.body.name, ..
            name: "track",
            description: "bla bla",
            timesPlayed: 0,
            test: [0,2,3],
            bestTimes: [["player1", 2.0], ["player2", 3.0]],
            waypoints: [[1,2,0], [4,5,0]]

        });
       
        connection.once("open", () => 
            track.save( (err: any, track: any) => {
                    if (err) return console.error(err);
                    res.send("test2");
                })
        );
        
    }



// doesn't work yet
    static getAll(req: Request, res: Response) : void {
        // MONGOOSE.connect(MONGODB_URI);
        // let connection: any = MONGOOSE.connection;
        // res.send(Track.find());

        // Track.find({}, {limit:10}).toArray(function(err: any, docs: any) {
        //     console.dir(docs);
        //   });


        MONGOOSE.connect(MONGODB_URI);
        let connection: any = MONGOOSE.connection;
        connection.once("open", () => 
            Track.find({}, 'name', function(err: any, tracks: any){
                if(err){
                console.log(err);
                } else{
                    res.render('user-list', tracks);
                    console.log('retrieved list of names', tracks.length, tracks[0].name);
                }
            })
        );

    } 
    

    static remove(/*req: Request, */res: Response, trackName: string) : void {
        console.log("deleting " + trackName);
        Track.find({ name: trackName }).remove( (err: any) =>{ if (err) return console.error(err); }).exec();
        res.send("removed");
    } 

    // static remove(/*req: Request, */res: Response, trackName: string) : void {
    //     console.log("deleting " + trackName);
    //     MONGOOSE.connect(MONGODB_URI);
    //     let connection: any = MONGOOSE.connection;
    //     connection.once("open", () => 
    //         Track.find({ name: trackName }).remove( (err: any) =>
    //                     { if (err) return console.error(err); }
    //                 ).exec()
    //     );
        
    //     res.send("removed");
    // } 

    static testConnection(res: Response): void {
        MONGOOSE.connect(MONGODB_URI);
        let connection: any = MONGOOSE.connection;
        connection.once("open", () => res.send("connection works"));
        
    }

}
