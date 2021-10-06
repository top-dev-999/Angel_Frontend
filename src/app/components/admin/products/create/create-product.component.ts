import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FileUploader, FileItem, ParsedResponseHeaders } from "ng2-file-upload";

import { ProductService } from "../../../../services/product/product.service";
import { AlertService } from "../../../../services/alert/alert.service";
import { LoadingService } from "../../../../services/loading.service";
import { StorageService } from "../../../../services/storage/storage.service";
import { environment } from "../../../../../environments/environment";

@Component({
    selector: "create-product",
    templateUrl: "./create-product.component.html",
    styleUrls: ["./create-product.component.css"]
})
export class CreateProductComponent implements OnInit {

    public product: any = {
        name: '',
        mode: 'gsm',
        price: 799.00,
        monthlyPrice: 99.00,
        yearlyPrice: 0.00
    };

    public image: { fileItem: FileItem, image: any };

    public token = this.storageService.getAuthToken();
    public uploader: FileUploader = new FileUploader({
        headers: [{ name: 'Authorization', value: "Bearer " + this.token }]
    });

    constructor(
        private router: Router,
        private alertService: AlertService,
        private loadingService: LoadingService,
        private productService: ProductService,
        private storageService: StorageService
    ) {}

    ngOnInit() {
        this.uploader.onBeforeUploadItem = (item) => {
            item.url = environment.baseUrl + `/product/${this.product.id}/image`,
            item.withCredentials = false;
        };
        this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
            let fileReader = new FileReader();
            fileReader.onload = (e:any) => {
                this.image = {
                    fileItem: fileItem,
                    image: e.target.result
                };
            };
            fileReader.readAsDataURL(fileItem._file);
        };
    }

    public clearImage() {
        this.uploader.clearQueue();
        this.image = null;
    }
    
    public onProductSubmit() {
        this.loadingService.show();

        this.productService.createProduct(this.product).subscribe(res => {
            
            this.product = res.product;
            this.uploader.uploadItem(this.image.fileItem);
            this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
                this.router.navigate(['admin', 'product', 'edit', res.product.id]);
                this.loadingService.hide();    
            };
            
        }, err => {
            this.alertService.alertError(err._body || "An unexpected error occurred, please try again later");
            this.loadingService.hide();
        });

        return false;
    }
}
