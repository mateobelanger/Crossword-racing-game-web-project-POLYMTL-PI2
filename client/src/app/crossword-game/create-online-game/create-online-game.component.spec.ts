import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOnlineGameComponent } from './create-online-game.component';

describe('CreateOnlineGameComponent', () => {
  let component: CreateOnlineGameComponent;
  let fixture: ComponentFixture<CreateOnlineGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOnlineGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOnlineGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
