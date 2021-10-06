import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "../api/api.service";

@Injectable()
export class CheckInService {

    constructor(private apiService: ApiService) {
    }

    public getCheckIns(): Observable<any> {
        return this.apiService.getJson('/user/check-in');
    }

    public getCheckIn(checkInId): Observable<any> {
        return this.apiService.getJson(`/user/check-in/${checkInId}`);
    }
}
