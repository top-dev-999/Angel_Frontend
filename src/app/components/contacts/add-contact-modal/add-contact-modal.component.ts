import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";

import { ContactService } from "../../../services/contact/contact.service";
import { Observable } from "rxjs";
import { promise } from "protractor";

@Component({
    selector: "add-contact-modal",
    templateUrl: "add-contact-modal.component.html",
    styleUrls: ["./add-contact-modal.component.css"]
})
export class AddContactModalComponent implements OnInit {

    public contact: any = {
        new: true,
        valid: true
    };
    public contacts = [];
    public filteredContacts = [];

    public allowSelection = true;
    public loading: Boolean = false;
    public error = null;
    public expand = false;

    constructor(
        public bsModalRef: BsModalRef,
        private contactService: ContactService
    ) {

    }

    ngOnInit() {
        this.fetchContacts();
    }

    fetchContacts() {
        this.contactService.getContacts().subscribe(res => {
            this.contacts = res.contacts;
            this.onSearchChange('');
        });
    }

    onSearchChange(filter) {
        filter = filter.toLowerCase();
        this.filteredContacts = this.contacts.filter(x => {
            return x.name.toLowerCase().includes(filter) || x.number.includes(filter);
        });
    }

    close() {
        this.bsModalRef.hide();
    }

    onContactSelected(contact) {
        this.contact = contact;
        this.contact.valid = true;
        this.expand = false;
    }

    validateContact() {
        const found = this.contacts.filter(existingContact => {
            return existingContact.number === this.contact.number;
        });
        if (found.length) {
            this.contact.valid = false;
        } else {
            this.contact.valid = true;
        }
    }

    async onContactSubmit() {
        if (this.contact.valid) {
            if (this.contact.new) {
                this.loading = true;
                this.contactService.createContact(this.contact).subscribe((res: any) => {
                    this.contactService.onContactSelected(res.contact);
                    this.close();
                }, err => {
                    this.error = err.message || err;
                    this.loading = false;
                });
            } else {
                this.close();
                this.contactService.onContactSelected(this.contact);
            }
        }
    }
}

