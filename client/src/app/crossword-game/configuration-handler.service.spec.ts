import { TestBed, inject } from '@angular/core/testing';

import { ConfigurationHandlerService } from './configuration-handler.service';

describe('ConfigurationHandlerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ConfigurationHandlerService]
        });
    });

    it('should be created', inject([ConfigurationHandlerService], (service: ConfigurationHandlerService) => {
        expect(service).toBeTruthy();
    }));
});
