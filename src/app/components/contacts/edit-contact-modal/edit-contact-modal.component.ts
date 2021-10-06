import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";

import { ContactService } from "../../../services/contact/contact.service";
import { IntlTelInputComponent } from "intl-tel-input-ng";

@Component({
    selector: "edit-contact-modal",
    templateUrl: "edit-contact-modal.component.html"
})
export class EditContactModalComponent implements AfterViewInit {

    @ViewChild(IntlTelInputComponent) telInput: IntlTelInputComponent;

    public contact: any = {};

    public loading: Boolean = false;
    public error = null;

    constructor(
        public bsModalRef: BsModalRef,
        private contactService: ContactService
    ) {}

    ngAfterViewInit() {
        this.telInput.phoneNumber = this.contact.number;
        this.telInput.i18nizePhoneNumber();
    }

    close() {
        this.bsModalRef.hide();
    }

    onContactSubmit() {
        this.loading = true;
        
        this.contactService.updateContact(this.contact).subscribe(res => {
            this.close();
        }, err => {
            this.error = err.message || err;
            this.loading = false;
        });
    }

    onDeleteContact() {
        this.loading = true;
        
        this.contactService.deleteContact(this.contact).subscribe(res => {
            this.close();
        }, err => {
            this.error = err.message || err;
            this.loading = false;
        });
    }
}
