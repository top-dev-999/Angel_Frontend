import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api/api.service';

@Injectable()
export class AlarmService {

  constructor(private apiService: ApiService) {
  }

  public getAlarms(): Observable<any> {
    return this.apiService.getJson('/user/alarm');
  }

  public getAlarm(alarmId): Observable<any> {
    return this.apiService.getJson(`/user/alarm/${alarmId}`);
  }

  public dismissAlarm(alarmId): Observable<any> {
    return this.apiService.postJson(`/user/alarm/${alarmId}/dismiss`, {});
  }

  public getAlarmInfo(alarmId): Observable<any> {
    return this.apiService.getJson(`/user/alarm/info/${alarmId}`);
  }

  getAlarmProfileImageNames(alarmId) {
    return this.apiService.getJson(`/user/alarm/info/file/names/${alarmId}`);
  }

  getAlarmProfileImage(profileId, file) {
    return this.apiService.getFile(`/user/alarm/info/file/${profileId}/${file}`);
  }
}
