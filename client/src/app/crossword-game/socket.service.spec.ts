import { TestBed, inject } from '@angular/core/testing';

import { SocketService } from './socket.service';
import { LobbyService } from './lobby/lobby.service';
import { WordService } from './word.service';
import { AppModule } from '../app.module';
import { routes } from '../app-routes.module';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';


describe('SocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [routes, AppModule, HttpClientModule],
      providers: [{provide: APP_BASE_HREF, useValue : '/' }, WordService,
                  SocketService, LobbyService]
    });
  });

  it('should be created', inject([SocketService], (service: SocketService) => {
    expect(service).toBeTruthy();
  }));
});
