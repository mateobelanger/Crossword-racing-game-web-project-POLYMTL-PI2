import { injectable, inject } from "inversify";
import { Router, Request, Response } from "express";
import Types from "../types";
import { DatamuseWordFinder } from "./datamuseWordFinder";

@injectable()
export class LexicalService {

    public constructor(@inject(Types.DatamuseWordFinder) private index: DatamuseWordFinder) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/service/lexical/wordsearch/:criteria/hard",
                   (req: Request, res: Response) =>
                    this.index.findWordsByDifficulty(req, res, false, false));

        router.get("/service/lexical/wordsearch/:criteria/normal",
                   (req: Request, res: Response) =>
                    this.index.findWordsByDifficulty(req, res, true, false));

        router.get("/service/lexical/wordsearch/:criteria/easy",
                   (req: Request, res: Response) =>
                    this.index.findWordsByDifficulty(req, res, true, true));

        router.get("/service/lexical/wordsearch/:criteria/common",
                   (req: Request, res: Response) =>
                    this.index.findWordsByRarity(req, res, true));

        router.get("/service/lexical/wordsearch/:criteria/uncommon",
                   (req: Request, res: Response) =>
                    this.index.findWordsByRarity(req, res, false));

        router.get("/service/lexical/wordsearch/:criteria",
                   (req: Request, res: Response) =>
                    this.index.findWords(req, res));

        return router;
    }
}
