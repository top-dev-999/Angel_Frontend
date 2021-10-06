import { Component, OnInit, TemplateRef, Output, EventEmitter } from "@angular/core";

import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { AlertService } from "../../../services/alert/alert.service";
import { LoadingService } from "../../../services/loading.service";
import { AuthService } from "../../../services/auth/auth.service";

@Component({
    selector: "order-authenticate",
    templateUrl: "./order-authenticate.component.html",
    styleUrls: ["./order-authenticate.component.css"]
})
export class OrderAuthenticateComponent implements OnInit {

    @Output() onAuthenticated = new EventEmitter<any>();

    public currentAccount: any = {};
    public existingAccount = {
        email: '',
        password: ''
    };
    public newAccount = {
        email: '',
        password: '',
        terms: false
    };
    public forgotEmail = '';

    private modalRef: BsModalRef;

    constructor(
        private alertService: AlertService,
        private modalService: BsModalService,
        private loadingService: LoadingService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.currentAccount = this.authService.getAccount();
    }

    onRegisterSubmit() {
        this.loadingService.show();

        this.authService.register(this.newAccount).subscribe(res => {
            if (res.success) {
                this.onAuthenticated.emit();
            } else {
                this.alertService.alertError(res.msg);
            }
            this.loadingService.hide();
        }, err => {
            this.alertService.alertError(err.message ? err.message : err);
            this.loadingService.hide();
        });

        return false;
    }

    onLoginSubmit() {
        this.loadingService.show();

        this.authService.authenticate(this.existingAccount).subscribe(res => {
            if (res.success) {
                this.onAuthenticated.emit();
            } else {
                this.alertService.alertError(res.msg);
            }
            this.loadingService.hide();
        }, err => {
            this.alertService.alertError(err.message ? err.message : err);
            this.loadingService.hide();
        });

        return false;
    }

    showModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }
    hideModal() {
        if (this.modalRef) { this.modalRef.hide(); }
        this.modalRef = null;
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

    continueAsCurrentUser() {
        this.onAuthenticated.emit();
    }
    logout() {
        this.authService.logout();
    }
    isAuthenticated() {
        return this.authService.isLoggedIn();
    }
}
