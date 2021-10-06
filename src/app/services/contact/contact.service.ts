import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "../api/api.service";

@Injectable()
export class ContactService {

    private listener: ContactEventListener;

    constructor(private apiService: ApiService) {
    }

    public getContacts() {
        return this.apiService.getJson(`/user/contact`);
    }

    public getContact(contactId) {
        return this.apiService.getJson(`/user/contact/${contactId}`);
    }

    public createContact(contact): Observable<any> {
        return new Observable(observer => {
            this.apiService.postJson(`/user/contact`, contact).subscribe(res => {
                observer.next(res);
                if (this.listener && this.listener.onContactAdded) {
                    this.listener.onContactAdded(res.contact);
                }
            },
            err => observer.error(err),
            () => observer.complete());
        });
    }

    public updateContact(contact): Observable<any> {
        return new Observable(observer => {
            this.apiService.postJson(`/user/contact/update`, contact).subscribe(res => {
                observer.next(res);
                if (this.listener && this.listener.onContactUpdated) {
                    this.listener.onContactUpdated(res.contact);
                }
            },
            err => observer.error(err),
            () => observer.complete());
        });
    }

    public deleteContact(contact): Observable<any> {
        return new Observable(observer => {
            this.apiService.postJson(`/user/contact/delete`, contact).subscribe(res => {
                observer.next(res);
                if (this.listener && this.listener.onContactRemoved) {
                    this.listener.onContactRemoved(contact);
                }
            },
            err => observer.error(err),
            () => observer.complete());
        });
    }

    public onContactSelected(contact) {
        if (this.listener && this.listener.onContactSelected) {
            this.listener.onContactSelected(contact);
        }
    }

    public subscribeToEvents(listener: ContactEventListener) {
        this.listener = listener;
    }
}


export interface ContactEventListener {
    onContactAdded?: (contact: any) => void;
    onContactUpdated?: (contact: any) => void;
    onContactRemoved?: (contact: any) => void;
    onContactSelected?: (contact: any) => void;
}