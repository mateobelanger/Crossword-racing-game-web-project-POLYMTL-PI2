import { JsonReader } from "./jsonReader";

const assert = require("assert");
const expectedResEasy: JSON = require("./expectedOutputTestEasy.json");
const expectedResNormal: JSON = require("./expectedOutputTestNormal.json");
const expectedResHard: JSON = require("./expectedOutputTestHard.json");
const data: JSON = require("./words.json");
const reader: JsonReader = new JsonReader();

describe("Lexical service:", () => {

    describe("Searching for easy words in a given list", () => {

        // won't include away : is non oun or adverb
        it("should return the length expected list", (done: MochaDone) => {
            assert.equal(Object.keys(reader.getValidWordsBasedOnDifficulty(data, true, true)).length, Object.keys(expectedResEasy).length);
            done();
        });
    });

    describe("Searching for normal words in a given list", () => {

        it("should return the length of expected list", (done: MochaDone) => {
            assert.equal(Object.keys(reader.getValidWordsBasedOnDifficulty(data, true, false)).length, Object.keys(expectedResNormal).length);
            done();
        });
    });

    describe("Searching for hard words in a given list", () => {

        it("should return the length of expected list", (done: MochaDone) => {
            assert.equal(Object.keys(reader.getValidWordsBasedOnDifficulty(data, false, false)).length, Object.keys(expectedResHard).length);
            done();
        });
    });

    it("valid common words should not include words without definitions", (done: MochaDone) => {
        assert.equal(reader.getValidWordsBasedOnDifficulty(data, true, true)[0].name, expectedResEasy[0].name);
        done();
    });

    it("valid uncommon words should not include words without definitions", (done: MochaDone) => {
        assert.equal(reader.getValidWordsBasedOnDifficulty(data, false, false)[0].name, expectedResHard[0].name);
        done();
    });

    it("valid definition should not include the word itself", (done: MochaDone) => {
        assert.equal(reader.getValidWordsBasedOnDifficulty(data, true, false)[2].definitionIndex, expectedResNormal[2].definitionIndex);
        done();
    });
 /* *

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
