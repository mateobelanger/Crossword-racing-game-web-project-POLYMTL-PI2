import { TestBed, inject } from "@angular/core/testing";

import { TextureLoaderService } from "./texture-loader.service";

describe("TextureLoaderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TextureLoaderService]
        });
    });

    it("should be created", inject([TextureLoaderService], (service: TextureLoaderService) => {
        expect(service).toBeTruthy();
    }));
});
