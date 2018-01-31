import { JsonReader } from "./jsonReader";

const assert = require("assert");
const expectedResponseCommon: JSON = require("./expectedOutputTestCommon.json");
const expectedResponseUncommon: JSON = require("./expectedOutputTestUncommon.json");
const inputJson: JSON = require("./words.json");
const reader: JsonReader = new JsonReader();

describe("Searching for", () => {

    describe("common words in a given list", () => {

        it("returns the expected list", (done: MochaDone) => {
            assert.equal(reader.getWordsBasedOnRarity(inputJson, true), expectedResponseCommon);
        });
    });

    describe("common words in a given list", () => {

        it("returns the expected list", (done: MochaDone) => {
            assert.equal(reader.getWordsBasedOnRarity(inputJson, false), expectedResponseUncommon);
        });
    });
});
