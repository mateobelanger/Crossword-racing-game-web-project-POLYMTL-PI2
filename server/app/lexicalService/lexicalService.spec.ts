import { WordSelector } from "./wordSelector";
import { assert } from "chai";

const expectedResultEasy: JSON = require("./expectedOutputTestEasy.json");
const expectedResultNormal: JSON = require("./expectedOutputTestNormal.json");
const expectedResultHard: JSON = require("./expectedOutputTestHard.json");
const data: JSON = require("./words.json");

describe("Lexical service:", () => {

    describe("Searching for easy words in a given list", () => {

        it("should return the length expected list", (done: MochaDone) => {
            assert.equal(Object.keys(WordSelector.getValidWordsBasedOnDifficulty(data, true, true)).length, 
                         Object.keys(expectedResultEasy).length);
            done();
        });
    });

    describe("Searching for normal words in a given list", () => {

        it("should return the length of expected list", (done: MochaDone) => {
            assert.equal(Object.keys(WordSelector.getValidWordsBasedOnDifficulty(data, true, false)).length,
                         Object.keys(expectedResultNormal).length);
            done();
        });
    });

    describe("Searching for hard words in a given list", () => {

        it("should return the length of expected list", (done: MochaDone) => {
            assert.equal(Object.keys(WordSelector.getValidWordsBasedOnDifficulty(data, false, false)).length,
                         Object.keys(expectedResultHard).length);
            done();
        });
    });

    it("valid words should not include words with definitions that include examples", (done: MochaDone) => {
        assert.equal(WordSelector.getValidWordsBasedOnDifficulty(data, false, false)[0].definitionIndex,
                     expectedResultHard[0].definitionIndex);
        done();
    });

    it("valid common words should not include words without definitions", (done: MochaDone) => {
        assert.equal(WordSelector.getValidWordsBasedOnDifficulty(data, true, true)[0].name,
                     expectedResultEasy[0].name);
        done();
    });

    it("valid uncommon words should not include words without definitions", (done: MochaDone) => {
        assert.equal(WordSelector.getValidWordsBasedOnDifficulty(data, false, false)[0].name,
                     expectedResultHard[0].name);
        done();
    });

    it("valid definition should not include the word itself", (done: MochaDone) => {
        const index: number = 2;
        assert.equal(WordSelector.getValidWordsBasedOnDifficulty(data, true, false)[index].definitionIndex,
                     expectedResultNormal[index].definitionIndex);
        done();
    });

});
