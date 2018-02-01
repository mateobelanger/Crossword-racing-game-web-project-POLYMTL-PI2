import { Request, Response, NextFunction } from "express";
import { Message } from "../../../common/communication/message";
import "reflect-metadata";
import { injectable, } from "inversify";
import { JsonReader } from "./jsonReader";

const datamuse = require("datamuse");

module Lexical {

    @injectable()
    export class Muse {

        public helloWorld(req: Request, res: Response, next: NextFunction): void {
            const message: Message = new Message();
            message.title = "Hello";
            message.body = "World";
            res.send(JSON.stringify(message));
        }

        public findWords(req: Request, res: Response, next: NextFunction): void {
            let criteria: String = req.params.criteria;
            while (criteria.includes("-")) {
                criteria = criteria.replace("-", "?");
            }

            datamuse.request("words?sp=" + criteria + "&md=f,d").then((json: JSON) =>
                res.send(json));
        }

        public findWordsBasedOnRarity(req: Request, res: Response, next: NextFunction, isCommon: boolean): void {
            let criteria: String = req.params.criteria;
            while (criteria.includes("-")) {
                criteria = criteria.replace("-", "?");
            }

            const reader: JsonReader = new JsonReader();
            datamuse.request("words?sp=" + criteria + "&md=f,d").then((json: JSON) =>
                res.send(reader.getWordsBasedOnRarity(json, isCommon)));
        }

        public findWordsBasedOnDifficulty(req: Request, res: Response, next: NextFunction, isCommon: boolean,  isEasy: boolean): void {
            let criteria: String = req.params.criteria;
            while (criteria.includes("-")) {
                criteria = criteria.replace("-", "?");
            }

            const reader: JsonReader = new JsonReader();
            datamuse.request("words?sp=" + criteria + "&md=f,d").then((json: JSON) =>
                res.send(reader.getValidWordsBasedOnDifficulty(json, isCommon, isEasy)));
        }

    }
}

export = Lexical;
