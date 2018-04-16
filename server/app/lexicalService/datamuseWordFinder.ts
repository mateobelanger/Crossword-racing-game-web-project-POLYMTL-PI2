import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { WordSelector, MAX_WORDS_PER_RESPONSE } from "./wordSelector";
import { DatamuseResponse, IDatamuseResponse } from "./datamuseResponse";

// tslint:disable-next-line:typedef
const DATAMUSE = require("datamuse");
const DATAMUSE_OPTIONS: string[] = ["words?sp=", "&md=f,d&max=" + MAX_WORDS_PER_RESPONSE];

module Lexical {

    @injectable()
    export class DatamuseWordFinder {

        public findWords(req: Request, res: Response): void {
            const template: string = req.params.criteria;
            DATAMUSE.request(DATAMUSE_OPTIONS[0] + template + DATAMUSE_OPTIONS[1])
                .then( (responses: IDatamuseResponse[]) => { res.send(responses[0]); });
        }

        public findWordsByRarity(req: Request, res: Response, isCommon: boolean): void {
            const criteria: string = this.switchHyphensToQuestionMarks(req.params.criteria);

            DATAMUSE.request(DATAMUSE_OPTIONS[0] + criteria + DATAMUSE_OPTIONS[1]).then((response: Array<DatamuseResponse>) =>
                res.send(WordSelector.getWordsByRarity(response, isCommon)));
        }

        public findWordsByDifficulty(req: Request, res: Response, isCommon: boolean,  isEasy: boolean): void {
            const criteria: string = this.switchHyphensToQuestionMarks(req.params.criteria);
            const isCompleteWord: boolean = (!criteria.includes("?"));

            DATAMUSE.request(DATAMUSE_OPTIONS[0] + criteria +  DATAMUSE_OPTIONS[1]).then((response: Array<DatamuseResponse>) => {
                response = response.map((dmResponse: IDatamuseResponse) => new DatamuseResponse(dmResponse));
                if (isCompleteWord) {
                    res.send(WordSelector.confirmWordByDifficulty(response, isCommon, isEasy, criteria));
                } else {
                    res.send(WordSelector.getValidWordsByDifficulty(response, criteria, isCommon, isEasy));
                }
            }).catch((error: Error) => console.error(error));
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
