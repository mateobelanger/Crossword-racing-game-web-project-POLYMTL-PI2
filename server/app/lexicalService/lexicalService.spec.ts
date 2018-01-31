import { JsonReader } from "./jsonReader";

const assert = require("assert");
const expectedResponseCommon: JSON = require("./expectedOutputTestCommon.json");
const expectedResponseUncommon: JSON = require("./expectedOutputTestUncommon.json");
const inputJson: JSON = require("./words.json");
const reader: JsonReader = new JsonReader();

describe("Searching for", () => {

    describe("common words in a given list", () => {

        it("returns the right length expected list", (done: MochaDone) => {
            assert.equal(Object.keys(reader.getValidWordsBasedOnRarity(inputJson, true)).length, Object.keys(expectedResponseCommon).length);
            done();
        });
    });

    describe("uncommon words in a given list", () => {
        
        it("returns the right length of expected list", (done: MochaDone) => {
            assert.equal(Object.keys(reader.getValidWordsBasedOnRarity(inputJson, false)).length, Object.keys(expectedResponseUncommon).length);
            done();
        });
    });

/*    describe("uncommon words in a given list", () => {

        it("returns the expected list", (done: MochaDone) => {
            assert.equal(reader.getValidWordsBasedOnRarity(inputJson, false), expectedResponseUncommon);
        });
    });
*/

 /*   describe("words without definitions are invalid", () => {

        it("returns the expected list", (done: MochaDone) => {
            assert.equal(reader.getValidWordsBasedOnRarity(inputJson, false), expectedResponseUncommon);
        });
    });
*/
});
