import { AfterViewInit, Component, ViewChild, OnInit, ElementRef, HostListener } from "@angular/core";

import { TrackEditorService } from './track-editor.service';



@Component({
  selector: 'app-track-editor',
  templateUrl: './track-editor.component.html',
  styleUrls: ['./track-editor.component.css']
})
export class TrackEditorComponent implements AfterViewInit, OnInit {


  @ViewChild("container")
  private containerRef: ElementRef;


  private get container(): HTMLDivElement {
      return this.containerRef.nativeElement;
  }

  public constructor (private trackEditorService: TrackEditorService) { }

  public ngOnInit() {
  }

  /*
  public ngAfterViewInit(): void {
    this.trackEditorRenderService
        .initialize(this.containerRef.nativeElement)
        .then( do nothing )
        .catch((err) => console.error(err));
} */

  @HostListener("window:click", ["$event"])
  public onLeftClick(event: MouseEvent): void {
      this.trackEditorService.handleLeftClick(event);
  }

  @HostListener("window:auxclick", ["$event"])
  public onRightClick(event: MouseEvent): void {
      this.trackEditorService.handleRightClick(event);
  }

  @HostListener("window:mousemove", ["$event"])
  public onMouseMove(event: MouseEvent): void {
    this.trackEditorService.handleMouseMove(event);
  }

  public ngAfterViewInit(): void {
    this.trackEditorService.initialize(this.container);
  }


}
