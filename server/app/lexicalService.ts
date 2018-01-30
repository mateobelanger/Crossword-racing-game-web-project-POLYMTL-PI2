import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Muse } from "./lexicalService/datamuseAccess";

@injectable()
export class LexicalService {

    public constructor(@inject(Types.Muse) private index: Muse) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/service/lexical/wordsearch/:criteria/uncommon",
                   (req: Request, res: Response, next: NextFunction) => this.index.findUncommonWords(req, res, next));

        router.get("/service/lexical/wordsearch/:criteria/common",
                   (req: Request, res: Response, next: NextFunction) => this.index.findCommonWords(req, res, next));

        router.get("/service/lexical/wordsearch/:criteria",
                   (req: Request, res: Response, next: NextFunction) => this.index.findWords(req, res, next));

        return router;
    }
}
