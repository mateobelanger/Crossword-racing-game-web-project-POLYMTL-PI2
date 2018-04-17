import { ITrackData } from "../../common/ITrackData";
import { Schema, Connection, Mongoose, Error, Model, Document } from "mongoose";

// Connection URL
const userName: string = "admin";
const password: string = "admin";
const dbName: string = "log2990-equipe4";
const MONGODB_URI: string = "mongodb://" + userName + ":" + password + "@ds115436.mlab.com:15436/" + dbName;
const MONGOOSE: Mongoose = require("mongoose");

const trackSchema: Schema = new MONGOOSE.Schema({
    name: String,
    description: String,
    timesPlayed: Number,
    bestTimes: [[String, Number]],
    waypoints: [[Number, Number, Number]],
    image: String
});

const TRACK: Model<Document> = MONGOOSE.model("Track", trackSchema);

export class MongoDBAccess {

    public static async getAll(): Promise<ITrackData[]> {
        void MONGOOSE.connect(MONGODB_URI);
        const db: Connection = MONGOOSE.connection;

        return new Promise<ITrackData[]>((resolve: Function, reject: Function) => {
            db.once("open", () => {
                TRACK.find(
                    (error: Error, trackData: ITrackData[]) => {
                        if (error) {
                            console.error(error);
                            reject(error);
                        } else {
                            resolve(trackData);
                        }
                    }
                );
            });
        });
    }

    public static async addTrack(track: ITrackData): Promise<ITrackData> {
        void MONGOOSE.connect(MONGODB_URI);
        const db: Connection = MONGOOSE.connection;

        // tslint:disable-next-line:no-any
        const newTrack: any = new TRACK(track);
        newTrack.bestTimes = [];
        newTrack.timesPlayed = 0;

        return new Promise<ITrackData>((resolve: Function, reject: Function) => {
            db.once("open", () => {
                newTrack.save(
                    (err: Error, trackSaved: ITrackData) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        }
                        resolve(newTrack);
                    }
                );

                resolve(newTrack);
            });
        });
    }

    public static async remove(trackName: string): Promise<void> {
        void MONGOOSE.connect(MONGODB_URI);
        const db: Connection = MONGOOSE.connection;

        return new Promise<void>((resolve: Function, reject: Function) => {
            db.once("open", () => {
                void TRACK.findOne({ name: trackName })
                    .remove((error: Error) => {
                        if (error) {
                            console.error(error);
                            reject(error);
                        }
                    })
                    .exec((error: Error) => {
                        if (error) {
                            console.error(error);
                            reject(error);
                        }
                        resolve();
                    });
            });
        });
    }

    public static async updateExistingTrack(track: ITrackData): Promise<void> {
        void MONGOOSE.connect(MONGODB_URI);
        const db: Connection = MONGOOSE.connection;

        return new Promise<void>((resolve: Function, reject: Function) => {
            db.once("open", () => {
                TRACK.update(
                    { name: track.name },
                    {
                        $set: {
                            description: track.description, timesPlayed: track.timesPlayed,
                            bestTimes: track.bestTimes, waypoints: track.waypoints,
                            image: track.image
                        }
                    },
                    (error: Error, numAffected: number) => {
                        if (error) {
                            console.error(error);
                            reject(error);
                        }
                        resolve();
                    }
                );

                resolve(track.name);
            });
        });
    }

    public static async incrementTimesPlayed(trackName: string): Promise<void> {
        void MONGOOSE.connect(MONGODB_URI);
        const db: Connection = MONGOOSE.connection;

        return new Promise<void>((resolve: Function, reject: Function) => {
            db.once("open", () => {
                TRACK.update(
                    { name: trackName },
                    { $inc: { timesPlayed: 1 } },
                    (error: Function, numAffected: number) => {
                        if (error) {
                            console.error(error);
                            reject(error);
                        }
                        resolve();
                    }
                );

                resolve();
            });
        });
    }

}
