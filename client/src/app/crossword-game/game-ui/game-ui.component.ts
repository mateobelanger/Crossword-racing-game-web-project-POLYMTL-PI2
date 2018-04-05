import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { WordService } from '../word.service';
import { GridService } from "../grid.service";
import { ValidatorService } from "../validator.service";
// import { SocketService } from "../socket.service";

@Component({
    selector: 'app-game-ui',
    templateUrl: './game-ui.component.html',
    styleUrls: ['./game-ui.component.css'],
    providers: [WordService, ValidatorService, GridService]
})

export class GameUiComponent implements OnInit {
    public constructor( private wordService: WordService, public validator: ValidatorService,
                        public grid: GridService/*, private route: ActivatedRoute, private socketService: SocketService*/) {}

    public async ngOnInit(): Promise<void> {
    //     await this.wordService.initialize(this.route.snapshot.paramMap.get("difficulty"))
    //         .then(() => {
    //             this.grid.initialize();
    //             this.validator.initialize();
    //         });
        // this.wordService = this.socketService.getWords();
        console.log("onInit");
        console.log(this.wordService.words);
    }

    public deselect(): void {
        this.wordService.deselect();
    }
}
