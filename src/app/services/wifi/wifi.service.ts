import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "../api/api.service";

@Injectable()
export class WifiService {

    constructor(private apiService: ApiService) {
    }

    public getWifi(deviceId, wifiId): Observable<any> {
        return this.apiService.getJson(`/user/device/${deviceId}/wifi/${wifiId}`);
    }

    public createWifi(deviceId, wifi): Observable<any> {
        return this.apiService.postJson(`/user/device/${deviceId}/wifi`, wifi);
    }

    public updateWifi(deviceId, wifi): Observable<any> {
        return this.apiService.postJson(`/user/device/${deviceId}/wifi/${wifi.id}`, wifi);
    }

    public deleteWifi(deviceId, wifiId) {
        return this.apiService.postJson(`/user/device/${deviceId}/wifi/${wifiId}/delete`, {});
    }
}
