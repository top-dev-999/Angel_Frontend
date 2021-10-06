import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "../api/api.service";

@Injectable()
export class DeviceService {

    constructor(private apiService: ApiService) {
    }

    public getDevices(): Observable<any> {
        return this.apiService.getJson('/user/device');
    }

    public getDevice(deviceId): Observable<any> {
        return this.apiService.getJson(`/user/device/${deviceId}`);
    }

    public createDevice(device) {
        return this.apiService.postJson('/user/device', device);
    }

    public updateDevice(device) {
        return this.apiService.postJson(`/user/device/update`, device);
    }

    public updateDeviceState(device, state) {
        return this.apiService.postJson(`/user/device/update-state`, { deviceId: device.id, state });
    }

    public setupDevice(device) {
        return this.apiService.postJson(`/user/device/setup`, device);
    }

    public deleteDevice(device) {
        return this.apiService.postJson(`/user/device/delete`, device);
    }


    public getDummyMessage(device, profiles) {
        
        let profile = profiles.filter(x => x.id == device.profileId)[0];

        let nameText = profile ? `${profile.name} ${profile.surname}` : '';
        let typeText = `An alarm has been raised by ${nameText}.`;
        let locationText = 'Location: http://maps.google.com/maps?q=' + -26.1076 + '%2C' + 28.0567 + '.';
        let timeText = `Triggered at: ${this.formatDate(new Date())}.`;
        let customMessage = device.message ? `A message from ${(profile ? profile.name : '')}: ${device.message}` : '';
        let link = `https://devices.angelaspirations.com/alarm/info/xyz.`;
    
        let message = `${typeText}<br>${locationText}<br>${timeText}<br>${link}<br>${customMessage}`;
    
        return message;
    };
    
    private formatDate(date) {
        return date.getFullYear() + '/' + 
            this.twoDigitString(date.getMonth()+1) + '/' + 
            this.twoDigitString(date.getDate()) + ' ' + 
            this.twoDigitString(date.getHours()) + ':' + 
            this.twoDigitString(date.getMinutes());
    };
    private twoDigitString(digit) {
        if (digit < 10) {
            return '0' + digit;
        }
        return digit + '';
    }
}
