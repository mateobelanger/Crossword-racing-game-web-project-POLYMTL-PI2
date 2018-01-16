import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { GrilleComponent } from './grille/grille.component';
import { DefinitionsComponent } from './definitions/definitions.component';
import { InformationsComponent } from './informations/informations.component';


@NgModule({
  declarations: [
    AppComponent,
    GrilleComponent,
    DefinitionsComponent,
    InformationsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
