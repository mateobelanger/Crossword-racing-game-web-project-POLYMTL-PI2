import { Response } from "express";

// const requestPromise = require("request-promise-native");

export class MongoDBAccess {

    public constructor() {

    }

    public helloWorld(res: Response): void {         

        res.send("Hello World");
    }

}
