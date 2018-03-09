import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import { Car } from "../car/car";
// import { ITrackData } from "../../../../../common/trackData";
import { RaceDataHandlerService} from "../race-data-handler.service";
import { ActivatedRoute } from "@angular/router";

const DEFAULT_TRACKNAME: string = "test";

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"]
})

export class GameComponent implements AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;
    // private trackData: ITrackData;
    // private userName: string = "no name";

    public constructor(private renderService: RenderService,
                       private raceDataHandlerService: RaceDataHandlerService,
                       private route: ActivatedRoute) { }

    // private renderService: RenderService;

    // public constructor() {
    //     this.renderService = this.route.snapshot.paramMap.get("trackName");
    // }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.renderService.handleKeyDown(event);
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.renderService.handleKeyUp(event);
    }

    public async ngAfterViewInit(): Promise<void> {
        let trackName: string = this.route.snapshot.paramMap.get("trackName");
        if (!this.isDefined(trackName))
            trackName = DEFAULT_TRACKNAME;
        await this.raceDataHandlerService.initialize(trackName);
        this.renderService
            .initialize(this.containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));

        this.raceDataHandlerService.startRace();
    }
/*
    public addTimeToBestTimes(time: number): void {
        this.bestTimesHandler.addTime([this.userName, time]);
    }

    public updateBestTimes(): void {
        this.trackData.bestTimes = this.bestTimesHandler.bestTimes;
    }
*/
    public get car(): Car {
        return this.renderService.car;
    }

    // tslint:disable:no-any
    private isDefined(object: any): boolean {
        return ((object !== null) && (object !== undefined));
    }// tslint:enable:no-any
}
