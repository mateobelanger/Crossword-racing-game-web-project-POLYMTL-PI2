import { TestBed, inject } from '@angular/core/testing';

import { Word, Direction } from '../../../../common/word';
import { GridService } from './grid.service';
import { WordService } from './word.service';
import { SelectionMediatorService } from './selection-mediator.service';
import { DefinitionsService } from './definitions.service';

const KEY_A: number = 65;
const KEY_I: number = 73;
const KEY_Z: number = 90;


const KEY_ALT: number = 18;
const KEY_CTRL: number = 17;
const KEY_7: number = 55;

const words: Word[] = [
    { row: 0, column: 0, direction: Direction.HORIZONTAL, size: 3, value: "sit", definition: "I like to ___ on my chair." },
    { row: 0, column: 5, direction: Direction.HORIZONTAL, size: 5, value: "value", definition: "The word is value." },
    { row: 0, column: 0, direction: Direction.VERTICAL, size: 3, value: "sat", definition: "I ___ on a chair." },
    { row: 1, column: 0, direction: Direction.HORIZONTAL, size: 5, value: "amour", definition: "Le sentiment envers Michel Gagnon" },
    { row: 0, column: 1, direction: Direction.VERTICAL, size: 5, value: "image", definition: "JPEG, PNG, GIF" },
    { row: 0, column: 2, direction: Direction.VERTICAL, size: 3, value: "tom", definition: "... a la ferme." }
];

const userGrid: string[][] = [
    ["S", "", "T", "", "", "", "", "", "", ""],
    ["", "", "O", "", "", "", "", "", "", ""],
    ["", "", "M", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""]
];

const validatedCells: boolean[][] = [
    [false, false, true, false, false, false, false, false, false, false],
    [false, false, true, false, false, false, false, false, false, false],
    [false, false, true, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false]
  ];


describe('GridService', () => {

    let wordService: WordService;
    let gridService: GridService;
    let definitionsService: DefinitionsService;
    let selectionMediatorService: SelectionMediatorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [GridService, WordService],
      });

      wordService = new WordService();
      wordService["words"] = words;

      gridService = new GridService(wordService);
      gridService.userGrid = userGrid;
      gridService.validatedCells = validatedCells;

      definitionsService = new DefinitionsService(wordService);

      selectionMediatorService = new SelectionMediatorService(gridService, definitionsService, wordService);


    });

    it('should be created', inject([GridService], (service: GridService) => {
      expect(service).toBeTruthy();
    }));

    // TODO : Verify
    it("should accept letters input from A to Z", () => {
      expect(gridService.keyDown(KEY_A, 0, 0)).toBeTruthy();
      expect(gridService.keyDown(KEY_I, 0, 0)).toBeTruthy();
      expect(gridService.keyDown(KEY_Z, 0, 0)).toBeTruthy();
    });

    // TODO : Verify
    it("should not accept special characters", () => {
      expect(gridService.keyDown(KEY_ALT, 0, 0)).toBeFalsy();
      expect(gridService.keyDown(KEY_CTRL, 0, 0)).toBeFalsy();
      expect(gridService.keyDown(KEY_7, 0, 0)).toBeFalsy();
    });

     // TODO : Verify
    it("should validate word when it is completed", () => {
      /*
      gridService.keyDown(KEY_I, 0, 2);
      selectionMediatorService.keyUp(KEY_I, 0, 2);

      expect(gridService.validatedCells[0][0]).toBeTruthy();
      expect(gridService.validatedCells[0][1]).toBeTruthy();
      expect(gridService.validatedCells[0][2]).toBeTruthy();
      */
    });

});
