import { Component, OnInit } from "@angular/core";
import { StorageService } from "../../services/storage/storage.service";

@Component({
    selector: "app-order",
    templateUrl: "./order.component.html",
    styleUrls: ["./order.component.css"]
})
export class OrderComponent implements OnInit {

    public step = 1;
    public finalStep = 4;

    private product: any = null;
    private authenticated = false;
    private billingInfo: any = null;

    constructor(private storageService: StorageService) {}

    ngOnInit() {
        let orderState = this.storageService.getOrderState();
        let timeDiff = new Date().getTime() - (orderState ? new Date(orderState.date).getTime() : 0);
        if (timeDiff < 3600000 /* 1 hour */) {
            this.product = orderState.product;
            this.authenticated = orderState.authenticated;
            this.billingInfo = orderState.billingInfo;
            this.step = orderState.step;
        }
    }

    stepTo(step) {
        if (step == 1) { this.step = 1; }
        if (step == 2 && this.product) { this.step = 2; }
        if (step == 3 && this.authenticated) { this.step = 3; }
        if (step == 4 && this.billingInfo) { this.step = 4; }
        this.saveOrderState();
    }

    onProductChosen(product) {
        this.product = product;
        this.step++;
        this.saveOrderState();
    }
    
    onAuthenticated() {
        this.authenticated = true;
        this.step++;
        this.saveOrderState();

    }

    onDeliverySet() {
        this.step++;
        this.saveOrderState();

    }

    onBillingInfoSaved(billingInfo) {
        this.billingInfo = billingInfo;
        this.step++;
        this.saveOrderState();
    }

    saveOrderState() {
        let orderState = {
            product: this.product,
            authenticated: this.authenticated,
            billingInfo: this.billingInfo,
            step: this.step,
            date: new Date()
        };
        this.storageService.setOrderState(orderState);
    }
}
