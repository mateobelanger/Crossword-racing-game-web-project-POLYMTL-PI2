import { AfterViewInit, Component, ViewChild, OnInit, ElementRef } from "@angular/core"; 
 
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
    this.trackEditorService.initialise(this.container); 
  }


}
