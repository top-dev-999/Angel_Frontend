import { Component, OnInit,  } from "@angular/core";
import { Router  } from "@angular/router";


@Component({
    templateUrl: "./terms-and-conditions.component.html",
    styleUrls: ["./terms-and-conditions.component.css"]
})
export class TermsAndConditionsComponent implements OnInit {

    constructor(
        private router: Router,
    ) { }

    ngOnInit() {
    }

}
