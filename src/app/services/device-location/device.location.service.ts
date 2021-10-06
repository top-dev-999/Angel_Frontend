import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api/api.service';
import { DeviceLocation } from '../../models/device.location';

@Injectable()
export class DeviceLocationService {

    constructor(private apiService: ApiService) {
    }

    public createOrUpdate(location: DeviceLocation): Observable<any> {
        return this.apiService.postJson(`/user/device/${location.deviceId}/location`, location);
    }
}
