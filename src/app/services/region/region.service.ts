import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "../api/api.service";

@Injectable()
export class RegionService {

    constructor(private apiService: ApiService) {
    }

    public getRegionById(deviceId, regionId): Observable<any> {
        return this.apiService.getJson(`/user/device/${deviceId}/region/${regionId}`);
    }

    public createRegion(deviceId, region) {
        return this.apiService.postJson(`/user/device/${deviceId}/region/create`, region);
    }

    public updateRegion(deviceId, regionId, region) {
        return this.apiService.postJson(`/user/device/${deviceId}/region/${regionId}`, region);
    }

    public deleteRegion(deviceId, regionId) {
        return this.apiService.postJson(`/user/device/${deviceId}/region/${regionId}/delete`, {});
    }
}
