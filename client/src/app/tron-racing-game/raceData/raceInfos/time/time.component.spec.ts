// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeComponent } from './time.component';
import { AppModule } from '../../../../app.module';
import { routes } from '../../../../app-routes.module';
import { APP_BASE_HREF } from '@angular/common';
import { InputHandlerService } from '../../../physics&interactions/controller/input-handler.service';

// describe('TimeComponent', () => {
//     let component: TimeComponent;
//     let fixture: ComponentFixture<TimeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{provide: APP_BASE_HREF, useValue : '/' }, InputHandlerService]
        })
            .compileComponents();
    }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(TimeComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
