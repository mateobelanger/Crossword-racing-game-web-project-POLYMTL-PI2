import { TestBed, inject } from '@angular/core/testing';

import { Word, Direction } from '../../../../common/word';
import { GridService } from './grid.service';
import { WordService } from './word.service';

const words: Word[] = [
  {row: 0, column: 0, direction: Direction.HORIZONTAL, size: 3, value: "sit", definition: "I like to ___ on my ass." },
  {row: 0, column: 5, direction: Direction.HORIZONTAL, size: 5, value: "value", definition: "The word is value." },
  {row: 0, column: 0, direction: Direction.VERTICAL, size: 3, value: "sat", definition: "I ___ on a chair." },
  {row: 1, column: 0, direction: Direction.HORIZONTAL, size: 5, value: "amour", definition: "Le sentiment de tous envers Michel Gagnon"},
  {row: 0 , column: 1, direction: Direction.VERTICAL, size: 5, value: "image", definition: "JPEG, PNG, GIF"},
  {row: 0 , column: 2, direction: Direction.VERTICAL, size: 3, value: "tom", definition: "... a la ferme."}
];


describe('GridService', () => {

  let wordService: WordService;
  let gridService: GridService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridService, WordService],
    });

    wordService = new WordService();
    wordService["_words"] = words;

    gridService = new  GridService(wordService);

  });

  it('should be created', inject([GridService], (service: GridService) => {
    expect(service).toBeTruthy();
  }));

});
