import { injectable} from "inversify";
import { Router, Request, Response } from "express";
import { MongoDBAccess } from "./mongoDBAccess";

@injectable()
export class MongoDBService {

    public constructor() {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/service/mongoDB",
                   (req: Request, res: Response) => {
                    MongoDBAccess.getAll(req, res);
                });

        router.post("/service/mongoDB",
                    (req: Request, res: Response) => {
                        MongoDBAccess.addTrack(req, res);
                    });

        router.delete(  "/service/mongoDB/:name",
                        (req: Request, res: Response) => { MongoDBAccess.remove(req.params.name, res);
                                                           console.log(req.params.name); }
                        );

        /*router.put(  "/service/mongoDB/:name",
                        (req: Request, res: Response) =>
                            {MongoDBAccess.update(req.params.name, res)}
        );*/

        router.patch(  "/service/mongoDB/:name",
                        (req: Request, res: Response) => {MongoDBAccess.incrementTimesPlayed(req.params.name, res);}
                        );

        // custom 404 page
        router.use((req: Request, res: Response) => {
            res.type("text/plain");
            res.status(404);
            res.send("404 - Not Found");
        });

        // function handleServerError(response: Response, error: string){
        //     console.log(error);
        //     response.type('text/plain');
        //     response.status(500);
        //     response.send('500 - Server Error');
        // }

        return router;

    }
}
