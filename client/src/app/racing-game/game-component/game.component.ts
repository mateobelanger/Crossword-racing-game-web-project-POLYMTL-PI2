import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import { Car } from "../car/car";
import { ITrackData } from "../../../../../common/trackData";
import { BestTimesHandler} from "../bestTimes/bestTimesHandler";
import { TracksProxyService} from "../tracks-proxy.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"]
})

export class GameComponent implements AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;
    private trackData: ITrackData;
    private bestTimesHandler: BestTimesHandler;
    private userName: string = "no name";

    public constructor(private renderService: RenderService,
                       private tracksProxyService: TracksProxyService,
                       private route: ActivatedRoute) {
                           this.bestTimesHandler = new BestTimesHandler();
                       }

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
        try {
            await this.tracksProxyService.initialize();
            this.trackData = this.tracksProxyService.findTrack( this.route.snapshot.paramMap.get("trackName"));
            this.bestTimesHandler = new BestTimesHandler(this.trackData.bestTimes);
        } catch (err) {
            console.error(err);
            this.bestTimesHandler = new BestTimesHandler();
        }
        this.renderService
            .initialize(this.containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
    }

    public addTimeToBestTimes(time: number): void {
        this.bestTimesHandler.addTime([this.userName, time]);
    }

    public updateBestTimes(): void {
        this.trackData.bestTimes = this.bestTimesHandler.bestTimes;
    }

    public get car(): Car {
        return this.renderService.car;
    }
}
