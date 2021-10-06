import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { AuthService } from '../../../services/auth/auth.service';
import { ValidateService } from '../../../services/validate/validate.service';
import { AlertService } from '../../../services/alert/alert.service';
import { ProfileService } from '../../../services/profile/profile.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    email: String;
    password: String;
    rememberUser: boolean = false;

    public forgotEmail = '';
    private modalRef: BsModalRef;

    constructor(
        private authService: AuthService,
        private validateService: ValidateService,
        private modalService: BsModalService,
        private alertService: AlertService,
        private profileService: ProfileService,
        private loadingService: LoadingService,
        private router: Router
    ) {
    }

    ngOnInit() { 
        const sideBar =  <HTMLElement>document.getElementsByClassName('sidebar')[0];
        sideBar.style.display = 'none';
    }

    onLoginSubmit() {
        const user = {
            email: this.email,
            password: this.password,
            rememberUser: this.rememberUser
        };

        let res = this.validateService.isLoginInputValid(user);
        if (!res.isValid) {
            this.alertService.alertError(res.message);
            return false;
        }

        this.loadingService.show();
        this.authService.authenticate(user).subscribe((res: any) => {
            if (res.success) {
                const sideBar =  <HTMLElement>document.getElementsByClassName('sidebar')[0];
                sideBar.style.display = 'block';
                this.getProfile();
            } else {
                this.alertService.alertError(res.msg);
            }
            this.loadingService.hide();
        }, err => {
            this.alertService.alertError('Failed to login, please try again later');
            this.loadingService.hide();
        });
    }

    private getProfile() {

        this.profileService.getAllProfiles().subscribe(res => {
            if (!res.profiles.length) {
                this.router.navigate(['profile', 'create']);
            } else {
                let profile = res.profiles[0];
                this.authService.setProfile(profile);
                this.alertService.alertSuccess(`Welcome ${profile.name} ${profile.surname}`);
                this.router.navigate(['']);
            }
            this.loadingService.hide();
        }, err => {
            this.alertService.alertSuccess('Welcome');
            this.router.navigate(['']);
            this.loadingService.hide();
        });
    }

    forgotPassword() {
        this.loadingService.show();
        
        this.authService.forgotPassword(this.forgotEmail).subscribe(res => {
            if (res.success) {
                this.alertService.alertSuccess(res.msg);
                this.hideModal();
            } else {
                this.alertService.alertError(res.msg);
            }
            this.loadingService.hide();
        }, err => {
            this.alertService.alertError(err.message ? err.message : err);
            this.loadingService.hide();
        });
    }

    showModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }
    hideModal() {
        if (this.modalRef) { this.modalRef.hide(); }
        this.modalRef = null;
    }

    navToForgotPassword() {
        this.router.navigate(['forgot-password']);
    }
}
