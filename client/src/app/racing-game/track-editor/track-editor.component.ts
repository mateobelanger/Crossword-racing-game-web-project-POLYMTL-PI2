import { AfterViewInit, Component, ViewChild, OnInit, ElementRef, HostListener } from "@angular/core";

import { TrackEditorService } from './track-editor.service';

const LEFTMOUSEBTN: number = 0;
const RIGHTMOUSEBTN: number = 2;

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
  }*/

  public ngAfterViewInit(): void {
    this.trackEditorService.initialize(this.container);
  } 


  @HostListener("mousedown", ["$event"])
  public onMouseDown(event: MouseEvent): void {
    switch(event.button) {
      case LEFTMOUSEBTN:
        this.trackEditorService.handleLeftMouseDown(event);
        console.log("Left click");
        break;
        
      case RIGHTMOUSEBTN:
        this.trackEditorService.handleRightMouseDown(event);
        console.log("Righ click");
        break;  
    }
  } 

  @HostListener("mouseup", ["$event"])
  public onMouseUp(event: MouseEvent): void {
    if(event.button === LEFTMOUSEBTN)
        this.trackEditorService.handleLeftMouseUp(event);
  }
   


  @HostListener("mousemove", ["$event"])
  public onMouseMove(event: MouseEvent): void {
    this.trackEditorService.handleMouseMove(event);
  }




}
