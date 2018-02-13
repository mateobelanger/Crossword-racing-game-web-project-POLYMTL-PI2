import { injectable} from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import { MongoDBAccess } from "./mongoDBAccess";

@injectable()
export class MongoDBService {

    public constructor() {}

    public get routes(): Router {
        const mongoDBAccess: MongoDBAccess = new MongoDBAccess();
        const router: Router = Router();

        router.get("/service/mongoDB",
            (req: Request, res: Response, next: NextFunction) => {
                mongoDBAccess.helloWorld(res);
            });

        return router;

    }
}