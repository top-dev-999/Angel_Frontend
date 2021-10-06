import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: "text-input-modal",
    templateUrl: "text-input-modal.component.html"
})
    export class TextInputModalComponent implements OnInit {

    public loading: Boolean = false;
    public error = null;
    
    public onAddClickedCallback;
    public caller;
    public text;

    public message;
    public title;

    constructor(
        public bsModalRef: BsModalRef
    ) {}

    ngOnInit() {}

    close() {
        this.bsModalRef.hide();
    }

    onAddClicked() {
        this.onAddClickedCallback(this);
    }
}
