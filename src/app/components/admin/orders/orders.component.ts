import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingService } from '../../../services/loading.service';
import { AlertService } from '../../../services/alert/alert.service';
import { OrderService } from '../../../services/order/order.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

    public newOrders = [];
    public oldOrders = [];

    constructor(
        private router: Router,
        private orderService: OrderService,
        private loadingService: LoadingService,
        private alertService: AlertService
    ) {
        this.fetchOrders();
    }

    fetchOrders() {
        this.loadingService.show();

        this.orderService.getAllOrders().subscribe(res => {
            this.loadingService.hide();

            this.newOrders = res.orders.filter(x => x.deliveryStatus == 'pending');
            this.oldOrders = res.orders.filter(x => x.deliveryStatus == 'delivered');
        }, err => {
            this.alertService.alertError(err.toString());
            this.loadingService.hide();
        });
    }

    navToOrder(order) {
        this.router.navigate(['admin', 'order', 'edit', order.id]);
    }

    getOrderName(order) {
        if (order.profile) return order.profile.name + ' ' + order.profile.surname;
        return 'No Profile Registered';
    }
    getOrderEmail(order) {
        if (order.profile) return order.profile.email;
        return 'No Profile Registered';
    }
    getOrderPhone(order) {
        if (order.profile) return order.profile.cellPhone;
        return 'No Profile Registered';
    }
}
