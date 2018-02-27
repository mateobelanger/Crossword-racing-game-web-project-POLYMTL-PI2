import { ITrackData } from "../../common/trackData";

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

    public static async getAll(): Promise<any> {
        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;

        return new Promise((resolve: any, reject: any) => {
            db.once("open", () => {
                TRACK.find(
                    (err: any, trackData: ITrackData[]) => {
                        if (err) {
                            return console.error(err);
                        }
                        resolve(trackData);
                    }
                );
            });
        });
    }

    public static async addTrack(track: ITrackData): Promise<any> {
        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;

        const newTrack: any = new TRACK(track);
        newTrack.bestTimes = [];
        newTrack.timesPlayed = 0;

        return new Promise((resolve: any, reject: any) => {
            db.once("open", () => {
                newTrack.save(
                    (err: any, trackSaved: ITrackData) => {
                        if (err) {
                            return console.error(err);
                        }
                        resolve(newTrack);
                    }
                );

                resolve(newTrack);
            });
        });
    }

    public static async remove(trackName: string): Promise<any> {
        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;

        return new Promise((resolve: any, reject: any) => {
            db.once("open", () => {
                TRACK.findOne({ name: trackName })
                    .remove((err: any) => {
                        if (err) {
                            return console.error(err);
                        }
                    })
                    .exec((err: any) => {
                        if (err) {
                            return console.error(err);
                        }
                        resolve(trackName);
                    });
            });
        });
    }

    public static async updateExistingTrack(track: ITrackData): Promise<any> {
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

    public static async incrementTimesPlayed(trackName: string): Promise<any> {
        MONGOOSE.connect(MONGODB_URI);
        const db: any = MONGOOSE.connection;

        return new Promise((resolve: any, reject: any) => {
            db.once("open", () => {
                TRACK.update(
                    { name: trackName },
                    { $inc: { timesPlayed: 1 } },
                    (err: any, numAffected: number) => {
                        if (err) {
                            console.error(err);
                        }
                        resolve(trackName);
                    }
                );

                resolve(trackName);
            });
        });
    }

}
