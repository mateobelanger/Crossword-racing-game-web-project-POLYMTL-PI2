import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Muse } from "./LexicalService/datamuseAccess";

@injectable()
export class LexicalService {

    public constructor(@inject(Types.Muse) private index: Muse) {}

    public get routes(): Router {
        const router: Router = Router();
        //let jsonFile: any;

        /*router.get("/lexicalservice/wordsearch/:criteria",
                   (req: Request, res: Response, next: NextFunction) => { jsonFile = this.index.findWords(req, res, next); next(); } ,
                   function (req, res, next) {
                    console.log('Res? ', jsonFile );    //jsonFile is undefined..
                    }    );*/

        router.get("/service/lexical/wordsearch/:criteria",
                   (req: Request, res: Response, next: NextFunction) => this.index.findWords(req, res, next));

        return router;
    }
}
