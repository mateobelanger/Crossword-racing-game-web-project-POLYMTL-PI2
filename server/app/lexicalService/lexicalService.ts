import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import Types from "../types";
import { DatamuseWordFinder } from "./datamuseWordFinder";

@injectable()
export class LexicalService {

    public constructor(@inject(Types.DatamuseWordFinder) private index: DatamuseWordFinder) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/service/lexical/wordsearch/:criteria/hard",
                   (req: Request, res: Response,
                    next: NextFunction) => this.index.findWordsBasedOnDifficulty(req, res, next, false, false));

        router.get("/service/lexical/wordsearch/:criteria/normal",
                   (req: Request, res: Response, next: NextFunction) =>
                    this.index.findWordsBasedOnDifficulty(req, res, next, true, false));

        router.get("/service/lexical/wordsearch/:criteria/easy",
                   (req: Request, res: Response, next: NextFunction) =>
                    this.index.findWordsBasedOnDifficulty(req, res, next, true, true));

        router.get("/service/lexical/wordsearch/:criteria/common",
                   (req: Request, res: Response, next: NextFunction) =>
                    this.index.findWordsBasedOnRarity(req, res, next, true));

        router.get("/service/lexical/wordsearch/:criteria/uncommon",
                   (req: Request, res: Response, next: NextFunction) =>
                    this.index.findWordsBasedOnRarity(req, res, next, false));

        router.get("/service/lexical/wordsearch/:criteria",
                   (req: Request, res: Response, next: NextFunction) =>
                    this.index.findWords(req, res, next));

        return router;
    }
}
