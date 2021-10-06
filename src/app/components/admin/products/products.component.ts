import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ProductService } from '../../../services/product/product.service';
import { LoadingService } from '../../../services/loading.service';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent {

    public products = [];

    constructor(
        private router: Router,
        private productService: ProductService,
        private loadingService: LoadingService,
        private alertService: AlertService
    ) {
        this.fetchProducts();
    }

    fetchProducts() {
        this.loadingService.show();

        this.productService.getProducts().subscribe(res => {
            this.loadingService.hide();
            this.products = res.products;
        }, err => {
            this.alertService.alertError(err.toString());
            this.loadingService.hide();
        });
    }

    navToProduct(product) {
        this.router.navigate(['admin', 'product', 'edit', product.id]);
    }
}
