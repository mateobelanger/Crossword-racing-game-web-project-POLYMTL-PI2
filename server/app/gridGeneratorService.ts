import { injectable/*, inject */} from "inversify";
import { Router, Request, Response, NextFunction } from "express";
//import * as requestPromise from "request-promise";

//import Types from "./types";
//import { LexicalService } from "./lexicalService/lexicalService";

import { GridGenerator } from "./crossword-game/grid-generator";

@injectable()
export class GridGeneratorService {

    public constructor() {}

    public get routes(): Router {
        const generator: GridGenerator = new GridGenerator();
        const router: Router = Router();

        router.get("/service/gridGenerator/:difficulty",
            (req: Request, res: Response, next: NextFunction) => {console.log("test1"); generator.generate(25, "easy")});

            /*async (req: Request, res: Response) => {
                    let x: any;
                    x = await Grid(req.params.criteria);
                    res.send(x)
                });*/
        return router;

    }
}