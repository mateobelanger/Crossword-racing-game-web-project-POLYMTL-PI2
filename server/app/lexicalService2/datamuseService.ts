import * as requestOption from 'request-promise-native';
import { JsonReader } from "../lexicalService2/jsonReader";

export class DatamuseService {

    public requestData: JSON;

    public constructor() {}

    public options = {
        method: 'GET',
        uri: 'http://api.datamuse.com/words',
        json: true,
        qs: {
            sp: "",
            md: "df",
            max: "100",
        },
        simple: true,
    };

    public requestWordInfo(word: string, difficulty: string): Promise<any> {
        this.options.qs.sp = word;
        let reader: JsonReader = new JsonReader;
        return requestOption(this.options)
            .then((res: JSON) => {
                if (difficulty === "hard") {
                    this.requestData = reader.getValidWordsBasedOnDifficulty(res, false, false);
                } else if (difficulty === "normal") {
                    this.requestData = reader.getValidWordsBasedOnDifficulty(res, true, false);
                } else {
                    this.requestData = reader.getValidWordsBasedOnDifficulty(res,  true, true);
                }
            }/*, reject => {
                console.log('Reject');
            }*/)
            .catch((err: any) => { console.log('Erreur...') });
    }

    async getWords(word: string, difficulty: string): Promise<any> {
        await this.requestWordInfo(word, difficulty);
        return "done";
    }
}