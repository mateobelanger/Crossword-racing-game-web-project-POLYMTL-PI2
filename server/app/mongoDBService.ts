import { injectable} from "inversify";
import { Router, Request, Response } from "express";
import { MongoDBAccess } from "./mongoDBAccess";
import { TrackData } from "../../common/trackData";

@injectable()
export class MongoDBService {

    // tslint:disable-next-line:no-empty
    public constructor() { }

    public get routes(): Router {
        const router: Router = Router();

        router.get( "/service/mongoDB",
                    async (req: Request, res: Response) => {
                        const tracksData: TrackData[] = await MongoDBAccess.getAll();

                        res.send(tracksData);
                    });

        router.post("/service/mongoDB",
                    async (req: Request, res: Response) => {
                        const trackData: TrackData = await MongoDBAccess.addTrack(req.body as TrackData);

                        res.send(trackData);
                    });

        router.delete(  "/service/mongoDB/:name",
                        async (req: Request, res: Response) => {
                            const trackName: string = await MongoDBAccess.remove(req.params.name);

                            res.send(trackName);
                        });

        router.put( "/service/mongoDB",
                    async (req: Request, res: Response) => {
                        const trackName: string = await MongoDBAccess.updateExistingTrack(req.body as TrackData);

                        res.send(trackName);
                    });

        router.patch(   "/service/mongoDB/:name",
                        async (req: Request, res: Response) => {
                            const trackName: string = await MongoDBAccess.incrementTimesPlayed(req.params.name);
                            res.send(trackName);
                        });

        return router;

    }
}
