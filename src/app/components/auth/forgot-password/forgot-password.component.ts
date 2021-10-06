import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../../services/auth/auth.service";
import { ValidateService } from "../../../services/validate/validate.service";
import { AlertService } from "../../../services/alert/alert.service";

@Component({
    selector: "app-forgot-password",
    templateUrl: "./forgot-password.component.html",
    styleUrls: ["./forgot-password.component.css"]
})
export class ForgotPasswordComponent implements OnInit {
    email: String;
    showForm: Boolean;

    constructor(
        private router: Router,
        private authService: AuthService,
        private validateService: ValidateService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.showForm = true;
    }

    onForgotPasswordSubmit() {
        if (!this.validateService.isValidEmailAddress(this.email)) {
            this.alertService.alertError("Please use a valid email address");
            return false;
        }

        this.showForm = false;
        // TODO show a spinner at this point

        this.authService.forgotPassword(this.email).subscribe(
            res => {
                if (res.success) {
                    this.alertService.alertSuccess(res.msg);
                } else {
                    this.alertService.alertError(res.msg);
                }
            },
            err => {
                this.alertService.alertError("An unexpected error has occurred, please try again later");
            },
            () => {}
        );
    }

    navToLogin() {
        this.router.navigate(["login"]);
    }
}
