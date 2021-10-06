import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api/api.service';

@Injectable()
export class ProfileService {

    constructor(private apiService: ApiService) {}

    getAllProfiles(): Observable<any> {
        return this.apiService.getJson('/user/profile/');
    }

    getProfile(profileId): Observable<any> {
        return this.apiService.getJson(`/user/profile/${profileId}`);
    }

    createProfile(profile): Observable<any> {
        return this.apiService.postJson('/user/profile', profile);
    }

    updateProfile(profile): Observable<any> {
        return this.apiService.postJson(`/user/profile/${profile.id}`, profile);
    }

    



    getUserInfo() {
        return this.apiService.getJson('/user/info');
    }

    updateUserInfo(userInfo) {
        return this.apiService.postJson('/user/info', userInfo);
    }

    getProfileImageNames(profileId) {
        return this.apiService.getJson(`/user/profile/file/names/${profileId}`);
    }

    getProfileImage(profileId, file) {
        return this.apiService.getFile(`/user/profile/file/${profileId}/${file}`);
    }

    deleteProfileImage(file) {
        return this.apiService.postJson(`/user/profile/file/delete`, file);
    }
}
