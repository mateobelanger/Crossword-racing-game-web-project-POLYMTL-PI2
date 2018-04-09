import { TestBed, inject } from '@angular/core/testing';

import { SocketService } from './socket.service';
import { LobbyService } from './lobby/lobby.service';
import { WordService } from './word.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';

describe('SocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketService, LobbyService, WordService, HttpClient, HttpHandler, Router]
    });
  });

  it('should be created', inject([SocketService], (service: SocketService) => {
    expect(service).toBeTruthy();
  }));
});
