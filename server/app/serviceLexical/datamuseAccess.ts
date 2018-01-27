import { Request, Response, NextFunction } from "express";
import { Message } from "../../../common/communication/message";
import "reflect-metadata";
import { injectable, } from "inversify";

const datamuse = require("datamuse");

module Lexical {

    @injectable()
    export class Muse {

        public helloWorld2(req: Request, res: Response, next: NextFunction): void {
            const message: Message = new Message();
            message.title = "Hello";
            message.body = "World";
            res.send(JSON.stringify(message));
        }

        public searchPossibilities2(req: Request, res: Response, next: NextFunction): void {
            let criteria: String = req.param("criteria");
            while (criteria.includes("-")) {
                criteria = criteria.replace("-", "?");
            }
            //res.send(criteria);
            //res.send("words?sp=" + criteria + "&md=f");
            datamuse.request("words?sp=" + criteria + "&md=f,d").then((json: JSON) => {res.send(json); });
        }
    }
}

export = Lexical;
