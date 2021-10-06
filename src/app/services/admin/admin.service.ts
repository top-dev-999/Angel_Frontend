import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "../api/api.service";

@Injectable()
export class AdminService {

    constructor(private apiService: ApiService) {
    }

    public getCommunications(): Observable<any> {
        return this.apiService.getJson('/admin/comms');
    }
}
