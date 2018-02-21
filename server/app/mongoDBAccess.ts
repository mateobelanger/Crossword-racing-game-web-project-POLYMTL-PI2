import { Request, Response } from "express";
import { TrackData } from "../../common/communication/trackData"
// import {} from "./schemas/trackSchema";

// mLab account:
// username: arault@outlook.com
// password: *x-qGMlC1vwh

// Connection URL
const userName: string = "admin";
const password: string = "admin";
const dbName: string = "log2990-equipe4";
const MONGODB_URI: string = "mongodb://" + userName + ":" + password + "@ds115436.mlab.com:15436/" + dbName;
// let Track = require("./schemas/Track.model");

const MONGOOSE: any = require("mongoose");

const trackSchema = MONGOOSE.Schema({
    name: String,
    description: String,
    timesPlayed: Number,
    bestTimes: [[String, Number]],
    waypoints: [[Number, Number, Number]]
});

const Track = MONGOOSE.model("Track", trackSchema);

export class MongoDBAccess {

    public constructor() {}

    // to do: change it according to req.body
    public static addTrack(req: Request, res: Response): void {

        MONGOOSE.connect(MONGODB_URI);
        const connection: any = MONGOOSE.connection;

        let track = new Track(req.body);

        // console.log(track);

        // add : track.set({ timesPlayed: 0 });    ????
        connection.once("open", () =>
            track.save( (err: any, track: any) => {
                    if (err) { return console.error(err); }
                    res.send(req.body);
                })
        );

    }

    public static getAll(req: Request, res: Response): void {

        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;
        db.once("open", () => {
            Track.find( (error: any, trackData: TrackData[]) => {
                if (error) { { return console.error(error); } }
                res.send(trackData);
            });
        });
    }

    public static remove(trackName: string, res: Response): void {

        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;
        db.once("open", () => {
            Track.findOne({ name: trackName })
            .remove( (err: any) => { if (err) { return console.error(err); } })
            .exec();
            res.send("removed");
    });
    }

    public static updateExistingTrack(req: Request, res: Response): void {

        const track: any = new Track(req.body);

        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;
        db.once("open", () => {
            Track.update({name : track.name},
                         {$set: {description: track.description, timesPlayed: 0, bestTimes: track.bestTimes, waypoints: track.waypoints} },
                         (err: any, numAffected: number) => { if (err) { return console.error(err); }
                }
            );
            res.send(track.name);
        });
    }

    // à vérifier
    public static incrementTimesPlayed(trackName: string, res: Response) : void {

        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;
        db.once("open", () => {
            Track.update({name : trackName}, {$inc: {timesPlayed: 1}},
                         (err: any, numAffected: number) => {
                    if (err) { return console.error(err); }
                }
            );
            res.send(trackName);
    });
    }

    public static testConnection(res: Response): void {
        MONGOOSE.connect(MONGODB_URI);
        const connection: any = MONGOOSE.connection;
        connection.once("open", () => res.send("connection works"));

    }

}

// connection dans une fonction? mieux de toujours etre connecte???
// track schema a la bonne place? 
