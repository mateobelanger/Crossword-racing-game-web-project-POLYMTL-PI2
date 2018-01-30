/*import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import * as requestPromise from "request-promise";

import Types from "./types";
import { LexicalService } from "./lexicalService";

@injectable()
export class GridGeneratorService {

    public constructor(@inject(Types.LexicalService) private index: LexicalService) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/service/gridGenerator/:criteria",
                   (req: Request, res: Response) => {
                       requestPromise("http://localhost:3000/service/lexical/wordsearch/:criteria")
                       .then( (response: string) => res.render("wordValidator", {data: JSON.parse(response)}))
                       .catch((err: string) => res.send("error")/*handleServerError(res.err)*//*)
                   });

        return router;
    }
}
*/