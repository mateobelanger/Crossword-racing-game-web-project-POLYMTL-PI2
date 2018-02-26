import { Request, Response } from "express";
import { TrackData } from "../../common/trackData";

// Connection URL
const userName: string = "admin";
const password: string = "admin";
const dbName: string = "log2990-equipe4";
const MONGODB_URI: string = "mongodb://" + userName + ":" + password + "@ds115436.mlab.com:15436/" + dbName;
// tslint:disable:no-any
const MONGOOSE: any = require("mongoose");

const trackSchema: any = MONGOOSE.Schema({
    name: String,
    description: String,
    timesPlayed: Number,
    bestTimes: [[String, Number]],
    waypoints: [[Number, Number, Number]]
});

const TRACK: any = MONGOOSE.model("Track", trackSchema);

export class MongoDBAccess {

    // tslint:disable-next-line:no-empty
    public constructor() { }

    public static getAll(req: Request, res: Response): void {

        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;
        db.once("open", () => {
            TRACK.find((error: any, trackData: TrackData[]) => {
                if (error) { { return console.error(error); } }
                res.send(trackData);
            });
        });
    }

    public static addTrack(req: Request, res: Response): void {

        MONGOOSE.connect(MONGODB_URI);
        const connection: any = MONGOOSE.connection;

        const track: any = new TRACK(req.body);
        track.bestTimes = [];
        track.timesPlayed = 0;

        connection.once("open", () =>
            track.save((err: any, trackSaved: any) => {
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
            TRACK.findOne({ name: trackName })
                .remove((err: any) => { if (err) { return console.error(err); } })
                .exec();
            res.send("removed");
        });
    }

    public static async updateExistingTrack(track: TrackData): Promise<any> {
        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;

        return new Promise((resolve: any, reject: any) => {
            db.once("open", () => {
                TRACK.update(
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
            TRACK.update(   {name: trackName },
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
