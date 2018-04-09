import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { WordService } from '../word.service';
import { GridService } from "../grid.service";
import { ValidatorService } from "../validator.service";
import { UserGridService } from '../user-grid.service';
import { SelectionStateService } from '../selection-state/selection-state.service';
// import { SocketService } from "../socket.service";

@Component({
    selector: 'app-game-ui',
    templateUrl: './game-ui.component.html',
    styleUrls: ['./game-ui.component.css'],
    providers: [ValidatorService, GridService, UserGridService]
})

export class GameUiComponent implements OnInit {
    public constructor( private selectionStateService: SelectionStateService,
                        private wordService: WordService, public validator: ValidatorService,
                        public gridService: GridService/*, private route: ActivatedRoute, private socketService: SocketService*/) {}

    public async ngOnInit(): Promise<void> {
    //     await this.wordService.initialize(this.route.snapshot.paramMap.get("difficulty"))
    //         .then(() => {
    //             this.grid.initialize();
    //             this.validator.initialize();
    //         });
        // this.wordService = this.socketService.getWords();

        console.log(this.wordService.words.length);

        this.gridService.initialize();
        this.validator.initialize();

        console.log("onInit");
        console.log(this.wordService.words);
    }

    public deselect(): void {
        this.selectionStateService.localSelectedWord = null;
    }
}
