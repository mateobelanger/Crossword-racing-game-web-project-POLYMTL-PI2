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

        public findWords(req: Request, res: Response, next: NextFunction): any {
            let criteria: String = req.params.criteria;
            let jsonFile: any;

            while (criteria.includes("-")) {
                criteria = criteria.replace("-", "?");
            }
            
            datamuse.request("words?sp=" + criteria + "&md=f,d").then((json: JSON) => { jsonFile = json; res.send(json)});


            return jsonFile;
        }
    }
}

export = Lexical;
