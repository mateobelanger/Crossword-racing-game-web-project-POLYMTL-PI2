import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})

export class AppComponent {
    public constructor(public router: Router) {}

    public crosswordGame(): void {
        this.router.navigate(["/crossword-game"]).catch( (error: Error) => console.error(error));
        window.location.reload();
    }

    public racingGame(): void {
        this.router.navigate(["/racing-game"]).catch( (error: Error) => console.error(error));
        window.location.reload();
    }

    public homepage(): void {
        this.router.navigate(["/"]).catch( (error: Error) => console.error(error));
        window.location.reload();
    }
}
