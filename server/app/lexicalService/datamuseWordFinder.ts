import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { WordSelector } from "./wordSelector";
import { DatamuseResponse } from "./IdatamuseResponse";

const DATAMUSE = require("datamuse");
const DATAMUSE_OPTIONS: string[] = ["words?sp=", "&md=f,d&max=250"];

module Lexical {

    @injectable()
    export class DatamuseWordFinder {

        public findWords(req: Request, res: Response, next: NextFunction): void {
            let criteria: string = this.switchHyphensToQuestionMarks(req.params.criteria);            

            DATAMUSE.request(DATAMUSE_OPTIONS[0] + criteria + DATAMUSE_OPTIONS[1]).then((response: Array<DatamuseResponse>) =>
                res.send(response));
        }

        public findWordsBasedOnRarity(req: Request, res: Response, next: NextFunction, isCommon: boolean): void {
            let criteria: string = this.switchHyphensToQuestionMarks(req.params.criteria);

            DATAMUSE.request(DATAMUSE_OPTIONS[0] + criteria + DATAMUSE_OPTIONS[1]).then((response: Array<DatamuseResponse>) =>
                res.send(WordSelector.getWordsBasedOnRarity(response, isCommon)));
        }

        public findWordsBasedOnDifficulty(req: Request, res: Response, next: NextFunction, isCommon: boolean,  isEasy: boolean): void {
            let criteria: string = this.switchHyphensToQuestionMarks(req.params.criteria);
            const isCompleteWord: boolean = (!criteria.includes("?"));
           
            DATAMUSE.request(DATAMUSE_OPTIONS[0] + criteria +  DATAMUSE_OPTIONS[1]).then((response: Array<DatamuseResponse>) =>
                {
                    response = response.map((res) => new DatamuseResponse(res));
                    if(isCompleteWord) {
                        res.send(WordSelector.confirmWordBasedOnDifficulty(response, isCommon, isEasy, criteria));
                    } else {
                        res.send(WordSelector.getValidWordsBasedOnDifficulty(response, criteria, isCommon, isEasy));
                    }
                }).catch((err: any) => console.error(err));
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
