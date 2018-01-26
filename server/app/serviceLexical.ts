import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./serviceLexical/index";

@injectable()
export class ServiceLexical {

    public constructor(@inject(Types.Index) private index: Index) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/service/lexical/wordsearch/:criteria",
                   (req: Request, res: Response, next: NextFunction) => this.index.helloWorld2(req, res, next));

        return router;
    }
}
