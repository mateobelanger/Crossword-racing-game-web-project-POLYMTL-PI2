import { JsonReader } from "./jsonReader";

const assert = require("assert");
const expectedResponseCommon: JSON = require("./expectedOutputTestCommon.json");
const expectedResponseUncommon: JSON = require("./expectedOutputTestUncommon.json");
const inputJson: JSON = require("./words.json");
const reader: JsonReader = new JsonReader();

describe("Lexical service:", () => {

    describe("Searching for common words in a given list", () => {

        it("should return the length expected list", (done: MochaDone) => {
            assert.equal(Object.keys(reader.getValidWordsBasedOnRarity(inputJson, true)).length, Object.keys(expectedResponseCommon).length);
            done();
        });
    });

    describe("Searching for uncommon words in a given list", () => {

        it("should return the length of expected list", (done: MochaDone) => {
            assert.equal(Object.keys(reader.getValidWordsBasedOnRarity(inputJson, false)).length, Object.keys(expectedResponseUncommon).length);
            done();
        });
    });

    it("valid common words should not include words without definitions", (done: MochaDone) => {
        assert.equal(reader.getValidWordsBasedOnRarity(inputJson, true)[0].name, expectedResponseCommon[0].name);
        done();
    });

    it("valid uncommon words should not include words without definitions", (done: MochaDone) => {
        assert.equal(reader.getValidWordsBasedOnRarity(inputJson, false)[0].name, expectedResponseUncommon[0].name);
        done();
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
