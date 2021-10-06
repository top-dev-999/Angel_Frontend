import { Injectable } from "@angular/core";

@Injectable()
export class StorageService {

    private static AUTH_TOKEN_KEY: string = "AUTH_TOKEN_KEY";
    private static PROFILE_KEY: string = "PROFILE_KEY";
    private static ORDER_STATE_KEY: string = "ORDER_STATE_KEY";

    constructor() {}

    public getAuthToken() {
        return localStorage.getItem(StorageService.AUTH_TOKEN_KEY);
    }
    public setAuthToken(token) {
        localStorage.setItem(StorageService.AUTH_TOKEN_KEY, token);
    }


    public getProfile() {
        let jsonString = localStorage.getItem(StorageService.PROFILE_KEY);
        return this.toObject(jsonString);
    }
    public setProfile(profile) {
        let jsonString = JSON.stringify(profile);
        localStorage.setItem(StorageService.PROFILE_KEY, jsonString);
    }

    public getOrderState() {
        let jsonString = localStorage.getItem(StorageService.ORDER_STATE_KEY);
        return this.toObject(jsonString);
    }
    public setOrderState(orderState) {
        let jsonString = JSON.stringify(orderState);
        localStorage.setItem(StorageService.ORDER_STATE_KEY, jsonString);
    }

    private toObject(string) {
        if (string) {
            return JSON.parse(string);
        } else {
            return null;
        }
    }
}
