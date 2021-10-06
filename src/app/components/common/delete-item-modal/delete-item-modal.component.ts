import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: "delete-item-modal",
    templateUrl: "delete-item-modal.component.html"
})
    export class DeleteItemModalComponent implements OnInit {

    public loading: Boolean = false;
    public error = null;
    
    public onDeleteClickedCallback;
    public caller;
    public item;
    public message;
    public title;

    constructor(
        public bsModalRef: BsModalRef
    ) {}

    ngOnInit() {}

    close() {
        this.bsModalRef.hide();
    }

    onDeleteClicked() {
        this.onDeleteClickedCallback(this);
    }
}
