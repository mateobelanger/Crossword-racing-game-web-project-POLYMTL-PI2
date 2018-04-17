import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { RenderService } from "../../gameRendering/render-service/render.service";
import { Car } from "../../physics&interactions/cars/car/car";
import { RaceDataHandlerService} from "../race-data-handler.service";
import { ActivatedRoute } from "@angular/router";
import { InputHandlerService } from "../../physics&interactions/controller/input-handler.service";
import { EndGameService, EndGameTable } from "../end-game/end-game.service";
import { CarHandlerService } from "../../physics&interactions/cars/car-handler.service";
import { AudioService } from "../../audio/audio.service";
import { CollisionHandlerService } from "../../physics&interactions/collisions/collision-handler.service";
import { OutOfBoundsHandlerService } from "../../physics&interactions/collisions/out-of-bounds-handler.service";

const DEFAULT_TRACKNAME: string = "test";

@Component({
    moduleId: module.id,
    selector: "app-game-ui-component",
    templateUrl: "./game-ui.component.html",
    styleUrls: ["./game-ui.component.css"],
    providers: [
        RenderService, CarHandlerService, AudioService,
        CollisionHandlerService, OutOfBoundsHandlerService,
        RaceDataHandlerService, InputHandlerService
    ]
})

export class GameUiComponent implements AfterViewInit {

    // tslint:disable-next-line:typedef
    public EndGameTable = EndGameTable;     // needed to use the enum in the HTML

    @ViewChild("container")
    private containerRef: ElementRef;

    public constructor(private renderService: RenderService,
                       private raceDataHandlerService: RaceDataHandlerService,
                       private inputHandlerService: InputHandlerService,
                       private route: ActivatedRoute,
                       private endGameService: EndGameService) { }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.inputHandlerService.handleInput(event, true);
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.inputHandlerService.handleInput(event, false);
    }

    public async ngAfterViewInit(): Promise<void> {
        this.endGameService.displayTable = EndGameTable.NO_TABLE;
        let trackName: string = this.route.snapshot.paramMap.get("trackName");
        if (!this.isDefined(trackName)) {
            trackName = DEFAULT_TRACKNAME;
        }

        await this.raceDataHandlerService.initialize(trackName, this.choseEasyDifficulty);
        await this.renderService.initialize(this.containerRef.nativeElement);
        await this.raceDataHandlerService.startCountdown();
    }

    public get choseEasyDifficulty(): boolean {
        return this.route.snapshot.paramMap.get("difficulty").localeCompare("true") === 0;
    }

    public get car(): Car {
        return this.renderService.car;
    }

    private isDefined<T>(object: T): boolean {
        return ((object !== null) && (object !== undefined));
    }
}
