import { Response } from "express";

// mLab account:
// username: arault@outlook.com
// password: *x-qGMlC1vwh

// Connection URL
// const userName: string = "admin";
// const password: string = "admin";
// const url: string = "mongodb://" + userName + ":" + password + "@ds115436.mlab.com:15436";
 
// Database Name
// const dbName = "log2990-equipe4";

export class MongoDBAccess {
    
    public constructor() {

    }

    public helloWorld(res: Response): void {

        res.send("Hello World");
    }
 
}
