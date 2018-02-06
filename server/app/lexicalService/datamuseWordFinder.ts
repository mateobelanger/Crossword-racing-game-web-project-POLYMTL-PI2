import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { WordSelector } from "./wordSelector";
//import { RequestAPI } from "request";

const DATAMUSE = require("datamuse");
const DATAMUSE_OPTIONS: string[] = ["words?sp=", "&md=f,d&max=250"];

module Lexical {

    @injectable()
    export class DatamuseWordFinder {

        public findWords(req: Request, res: Response, next: NextFunction): void {
            let criteria: string = this.switchHyphensToQuestionMarks(req.params.criteria);            

            DATAMUSE.request(DATAMUSE_OPTIONS[0] + criteria + DATAMUSE_OPTIONS[1]).then((response: JSON) =>
                res.send(response));
        }

        public findWordsBasedOnRarity(req: Request, res: Response, next: NextFunction, isCommon: boolean): void {
            let criteria: string = this.switchHyphensToQuestionMarks(req.params.criteria);

            DATAMUSE.request(DATAMUSE_OPTIONS[0] + criteria + DATAMUSE_OPTIONS[1]).then((response: JSON) =>
                res.send(WordSelector.getWordsBasedOnRarity(response, isCommon)));
        }

        public findWordsBasedOnDifficulty(req: Request, res: Response, next: NextFunction, isCommon: boolean,  isEasy: boolean): void {
            let criteria: string = this.switchHyphensToQuestionMarks(req.params.criteria);
            const isCompleteWord: boolean = (!criteria.includes("?"));
           
            DATAMUSE.request("words?sp=" + criteria +  "&md=f,d&max=250").then((response: JSON) =>
                {
                    if(isCompleteWord) {
                        res.send(WordSelector.confirmWordBasedOnDifficulty(response, isCommon, isEasy, criteria));
                    } else {
                        res.send(WordSelector.getValidWordsBasedOnDifficulty(response, isCommon, isEasy));
                    }
                });
        }

        private switchHyphensToQuestionMarks (criteria: string): string {
            while (criteria.includes("-")) {
                criteria = criteria.replace("-", "?");
            }

            return criteria;
        }

    }
}

export = Lexical;
