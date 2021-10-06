import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { BsModalService, ModalOptions, BsModalRef } from "ngx-bootstrap/modal";
import { ContactService, ContactEventListener } from "../../services/contact/contact.service";

import { AddContactModalComponent } from "../contacts/add-contact-modal/add-contact-modal.component";
import { EditContactModalComponent } from "../contacts/edit-contact-modal/edit-contact-modal.component";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  public contactsLoading = false;
  public contacts = [];

  constructor(
    private contactService: ContactService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.fetchContacts();

    this.contactService.subscribeToEvents(this);
  }

  private fetchContacts() {
    this.contactsLoading = true;
    this.contactService.getContacts().subscribe(res => {
        this.contacts = res.contacts;
        this.contactsLoading = false;
    }, err => {
        this.contactsLoading = false;
    });
  }

  public openAddContactModal() {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
        allowSelection: false
    };
    this.modalService.show(AddContactModalComponent, options);
  }

  public openEditContactModal(contact) {
      const options: ModalOptions = new ModalOptions();
      options.initialState = {
          contact: JSON.parse(JSON.stringify(contact)),
      };
      this.modalService.show(EditContactModalComponent, options);
  }

  public onContactAdded(contact) {
      this.contacts.push(contact);
  }
  public onContactUpdated(contact) {
      this.contacts = this.contacts.map(x => {
          if (x.id == contact.id) { x = contact; }
          return x;
      });
  }
  public onContactRemoved(contact) {
      this.contacts = this.contacts.filter(x => x.id != contact.id);
  }

}
