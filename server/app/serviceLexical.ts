import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Muse } from "./serviceLexical/datamuseAccess";

@injectable()
export class ServiceLexical {

    public constructor(@inject(Types.Muse) private index: Muse) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/lexicalservice/wordsearch/:criteria",
                   (req: Request, res: Response, next: NextFunction) => this.index.searchPossibilities2(req, res, next));

        //router.get("/service/lexical/wordsearch/:criteria",
                   //(req: Request, res: Response, next: NextFunction) => this.index.helloWorld2(req, res, next));

        return router;
    }
}
