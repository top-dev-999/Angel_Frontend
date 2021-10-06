import { Component, OnInit } from "@angular/core";
import { ValidateService } from "../../../services/validate/validate.service";
import { AuthService } from "../../../services/auth/auth.service";
import { AlertService } from "../../../services/alert/alert.service";

@Component({
    selector: "app-change-password",
    templateUrl: "./change-password.component.html",
    styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {

    password: string;
    newPassword: string;
    confirmNewPassword: string;

    constructor(
        private validateService: ValidateService,
        private authService: AuthService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.password = "";
        this.newPassword = "";
        this.confirmNewPassword = "";
    }

    onChangePasswordSubmit(form, event) {
        event.preventDefault();

        let res = this.validateService.isValidPassword(this.newPassword, this.confirmNewPassword);
        if (!res.isValid) {
            this.alertService.alertError(res.message);
            return false;
        }

        this.authService.updateUserPassword(this.password, this.newPassword).subscribe(res => {
            this.alertService.alertSuccess(res.msg);
        },
        err => {
            let message = err._body ? err._body : "An unexpected error occurred, please try again later";
            this.alertService.alertError(message);
        },
        () => {});
    }
}
