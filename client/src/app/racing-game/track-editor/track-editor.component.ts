import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from "@angular/core";

import { TrackEditorRenderService } from './track-editor-render.service';


@Component({
  selector: 'app-track-editor',
  templateUrl: './track-editor.component.html',
  styleUrls: ['./track-editor.component.css']
})
export class TrackEditorComponent implements AfterViewInit, OnInit {


  @ViewChild("container")
  private containerRef: ElementRef;

// Je pense qu'on va devoir faire passser le service au complet et
// non juste le renderServive quand il va y avoir d'autre componenet  */
  public constructor (private trackEditorRenderService: TrackEditorRenderService) { }

  public ngOnInit(): void {
  }


  //TODO: We will need to add something that looks like that for the listener
  /*
  public ngAfterViewInit(): void {
    this.trackEditorRenderService
        .initialize(this.containerRef.nativeElement)
        .then(/* do nothing )
        .catch((err) => console.error(err));
   }


    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.trackEditorRenderService.onResize();


    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.trackEditorRenderService.handleKeyDown(event);

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.trackEditorRenderService.handleKeyUp(event);

*/

  public ngAfterViewInit(): void {
      this.trackEditorRenderService
          .initialize(this.containerRef.nativeElement);
  }


}
