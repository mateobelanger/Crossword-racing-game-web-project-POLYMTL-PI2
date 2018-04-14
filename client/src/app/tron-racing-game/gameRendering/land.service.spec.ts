import { TestBed, inject } from '@angular/core/testing';

import { LandService, LAND_TEXTURE } from './land.service';
import { ASSETS_FOLDER, ASSETS_NAME } from './trackBuildingBlocks/planeHandler';
import { PlaneType, CircleType } from '../constants';

describe('LandService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LandService]
        });
    });

    it('should be created', inject([LandService], (service: LandService) => {
        expect(service).toBeTruthy();
    }));

    it("should not have the same texture than track's texture", () => {
        expect(LAND_TEXTURE === ASSETS_FOLDER + ASSETS_NAME[PlaneType.INVALID_PLANE]).toBeFalsy();
        expect(LAND_TEXTURE === ASSETS_FOLDER + ASSETS_NAME[PlaneType.INVALID_FIRST_PLANE]).toBeFalsy();
        expect(LAND_TEXTURE === ASSETS_FOLDER + ASSETS_NAME[PlaneType.VALID_PLANE]).toBeFalsy();
        expect(LAND_TEXTURE === ASSETS_FOLDER + ASSETS_NAME[PlaneType.VALID_FIRST_PLANE]).toBeFalsy();
    });

    it("should not have the same texture than point's texture", () => {
        expect(LAND_TEXTURE === ASSETS_FOLDER + ASSETS_NAME[CircleType.TRACK_CRICLES]).toBeFalsy();
        expect(LAND_TEXTURE === ASSETS_FOLDER + ASSETS_NAME[CircleType.TRACK_EDITOR_CRICLES]).toBeFalsy();
        expect(LAND_TEXTURE === ASSETS_FOLDER + ASSETS_NAME[CircleType.TRACK_EDITOR_FIRST_CRICLE]).toBeFalsy();
        expect(LAND_TEXTURE === ASSETS_FOLDER + ASSETS_NAME[CircleType.TRACK_FIRST_CRICLE]).toBeFalsy();
    });
});

