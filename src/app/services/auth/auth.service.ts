import { Injectable } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from "rxjs";

import { ApiService } from "../api/api.service";
import { StorageService } from "../storage/storage.service";

@Injectable()
export class AuthService {
    private jwtHelper: JwtHelperService;

    private account: any;
    private profile: any;
    private authToken: any;
    private isAuthenticated: boolean;

    constructor(
        private apiService: ApiService,
        private storageService: StorageService
    ) {
        this.jwtHelper = new JwtHelperService();

        this.resetAccount();
    }

    private resetAccount() {
        this.authToken = null;
        this.account = null;
        this.profile = null;
        this.isAuthenticated = false;
    }

    public checkTokenStatus() {
        let token = this.storageService.getAuthToken();
        if (!token) {
            this.logout();
            return;
        }

        let account = this.jwtHelper.decodeToken(token);
        if (this.jwtHelper.isTokenExpired(token)) {
            if (account.remember) {
                this.refreshToken(token);
            } else {
                this.logout();
            }
        } else {
            this.authToken = token;
            this.account = account;
            this.profile = this.storageService.getProfile();
            this.isAuthenticated = true;
        }
    }

    private refreshToken(token) {
        this.apiService.postJson("/auth/refresh-token", { token: token }).subscribe(
            res => {
                if (res.success) {
                    this.storeAuthToken(res.token);
                    this.profile = this.storageService.getProfile();
                } else {
                    console.log(JSON.stringify(res));
                }
            },
            err => {
                console.log(JSON.stringify(err));
            }
        );
    }

    public register(account): Observable<any> {
        return new Observable(observer => {
            this.apiService.postJson("/auth/register", account).subscribe(
                res => {
                    if (res.success) {
                        this.storeAuthToken(res.token);
                    }
                    observer.next(res);
                },
                err => observer.error(err),
                () => observer.complete()
            );
        });
    }

    public authenticate(account): Observable<any> {
        return new Observable(observer => {
            this.apiService.postJson("/auth/login", account).subscribe(
                res => {
                    if (res.success) {
                        this.storeAuthToken(res.token);
                    }
                    observer.next(res);
                },
                err => observer.error(err),
                () => observer.complete()
            );
        });
    }

    public storeAuthToken(token) {
        this.storageService.setAuthToken(token);

        this.authToken = token;
        this.account = this.jwtHelper.decodeToken(token);
        this.isAuthenticated = true;
    }

    public forgotPassword(email) {
        return this.apiService.postJson("/auth/forgot-password", {
            email: email
        });
    }

    public updateUserPassword(password, newPassword) {
        return this.apiService.postJson("/user/update-password", {
            currentPassword: password,
            newPassword: newPassword
        });
    }

    public isLoggedIn() {
        return this.isAuthenticated;
    }

    public getAuthToken() {
        return this.authToken;
    }

    public getAccount() {
        return this.account;
    }

    public logout() {
        localStorage.clear();
        this.resetAccount();
    }

    public getProfile() {
        return this.profile;
    }
    public setProfile(profile) {
        this.profile = profile;
        this.storageService.setProfile(profile);
    }

    public getRole() {
        if (this.account) {
            return this.account.role;
        }
        return null;
    }
}
