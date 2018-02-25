import { Request, Response } from "express";
import { TrackData } from "../../common/trackData";

// mLab account:
// username: arault@outlook.com
// password: *x-qGMlC1vwh

// Connection URL
const userName: string = "admin";
const password: string = "admin";
const dbName: string = "log2990-equipe4";
const MONGODB_URI: string = "mongodb://" + userName + ":" + password + "@ds115436.mlab.com:15436/" + dbName;
// let Track = require("./schemas/Track.model");
// tslint:disable:no-any
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

    public constructor() { }

    public static getAll(req: Request, res: Response): void {

        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;
        db.once("open", () => {
            Track.find((error: any, trackData: TrackData[]) => {
                if (error) { { return console.error(error); } }
                res.send(trackData);
            });
        });
    }

    public static addTrack(req: Request, res: Response): void {

        MONGOOSE.connect(MONGODB_URI);
        const connection: any = MONGOOSE.connection;

        const track: any = new Track(req.body);
        track.bestTimes = [];
        track.timesPlayed = 0;

        connection.once("open", () =>
            track.save((err: any, track: any) => {
                if (err) {
                    return console.error(err);
                }
                res.send(req.body);
            })
        );

    }

    public static remove(trackName: string, res: Response): void {

        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;
        db.once("open", () => {
            Track.findOne({ name: trackName })
                .remove((err: any) => { if (err) { return console.error(err); } })
                .exec();
            res.send("removed");
        });
    }

    public static updateExistingTrack(track: TrackData): Promise<string> {
        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;

        return new Promise((resolve: any, reject: any) => {
            db.once("open", () => {
                Track.update(
                    { name: track.name },
                    {
                        $set: {
                            description: track.description, timesPlayed: 0,
                            bestTimes: [], waypoints: track.waypoints
                        }
                    },
                    (err: any, numAffected: number) => {
                        if (err) {
                            console.error(err);
                        }
                        resolve(track.name);
                    }
                );

                resolve(track.name);
            });
        });
    }

    // à vérifier
    public static incrementTimesPlayed(trackName: string, res: Response): void {

        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;
        db.once("open", () => {
            Track.update(   {name: trackName },
                            { $inc: { timesPlayed: 1 } },
                            (err: any, numAffected: number) => {
                                if (err) {
                                    return console.error(err);
                                }
                            }
            );
            res.send(trackName);
        });
    }

}
