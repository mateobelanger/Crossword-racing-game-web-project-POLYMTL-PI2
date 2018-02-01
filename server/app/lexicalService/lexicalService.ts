import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "../types";
import { Muse } from "./datamuseAccess";

@injectable()
export class LexicalService {

    public constructor(@inject(Types.Muse) private index: Muse) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/service/lexical/wordsearch/:criteria/hard",
                   (req: Request, res: Response, next: NextFunction) => this.index.findWords(req, res, next, false, false));

        router.get("/service/lexical/wordsearch/:criteria/normal",
                   (req: Request, res: Response, next: NextFunction) => this.index.findWords(req, res, next, true, false));

        router.get("/service/lexical/wordsearch/:criteria/easy",
                   (req: Request, res: Response, next: NextFunction) => this.index.findWords(req, res, next, true, true));

        // a game is easy by default
        router.get("/service/lexical/wordsearch/:criteria",
                   (req: Request, res: Response, next: NextFunction) => this.index.findWords(req, res, next, true, true));

        return router;
    }
}
