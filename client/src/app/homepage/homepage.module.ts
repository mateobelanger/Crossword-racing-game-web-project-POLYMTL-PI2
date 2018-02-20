import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { HomepageComponent } from './homepage.component';
import { routes } from '../app-routes.module';

@NgModule({
    imports: [
        CommonModule,
        routes
    ],

    declarations: [
        HomepageComponent,
    ],

    exports: [
        HomepageComponent,
    ]
})
export class HomepageModule { }
