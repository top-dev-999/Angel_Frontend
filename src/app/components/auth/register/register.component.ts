import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";

import { AlertService } from "../../../services/alert/alert.service";
import { AuthService } from "../../../services/auth/auth.service";
import { ValidateService } from '../../../services/validate/validate.service';
import { LoadingService } from "../../../services/loading.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    account = {
        email: '',
        password: '',
        confirmPassword: ''
    };

    id = 'W5uJN23zVQ4';
    playerWidth = 400;
    private player;
    private ytEvent;

    constructor(
        private alertService: AlertService,
        private authService: AuthService,
        private router: Router,
        private validateService: ValidateService,
        private loadingService: LoadingService
    ) {
    }

    ngOnInit() {
        this.resizeVideoWindow();
    }

    private resizeVideoWindow() {
        let width = window.innerWidth;
        if (width < 768) {
            this.playerWidth = 320;
        } else {
            this.playerWidth = 460;
        }
    }

    onStateChange(event) {
        this.ytEvent = event.data;
    }

    savePlayer(player) {
        this.player = player;
    }

    navToTermsAndConditions(){
        this.router.navigate(['terms-and-conditions']);
    }

    onRegisterSubmit() {
        let result = this.validateService.isRegisterInputValid(this.account);
        if (!result.isValid) {
            this.alertService.alertError(result.message);
            return false;
        }

        this.loadingService.show();
        this.authService.register(this.account).subscribe(
            data => {
                if (data.success) {
                    this.router.navigate(['profile', 'create']);
                } else {
                    this.alertService.alertError(data.msg);
                }
                this.loadingService.hide();
            }, err => {
                this.alertService.alertError('Something went wrong, please try again later');
                this.loadingService.hide();
            }
        );

        return false;
    }

}