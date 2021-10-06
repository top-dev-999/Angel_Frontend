import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ProductService } from "../../../services/product/product.service";
import { LoadingService } from "../../../services/loading.service";
import { AlertService } from "../../../services/alert/alert.service";

@Component({
    selector: "order-products",
    templateUrl: "./order-products.component.html",
    styleUrls: ["./order-products.component.css"]
})
export class OrderProductsComponent implements OnInit {

    @Output() onProductChosen = new EventEmitter<any>();

    public selectedProduct: any = {};
    public products = [];

    constructor(
        private loadingService: LoadingService,
        private alertService: AlertService,
        private productsService: ProductService
    ) {}

    ngOnInit() {
        this.fetchProducts();
    }
    
    private fetchProducts() {
        this.loadingService.show();

        this.productsService.getProducts().subscribe(res => {
            this.products = res.products;
            this.selectedProduct = this.products[0];
            this.loadingService.hide();
        }, err => {
            this.alertService.alertError('An unexpected error occurred, please try again later');
            this.loadingService.hide();
        });
    }

    public onProceedClick() {
        this.onProductChosen.emit(this.selectedProduct);
    }
}
