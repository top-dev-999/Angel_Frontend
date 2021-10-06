import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FileUploader, FileItem, ParsedResponseHeaders } from "ng2-file-upload";

import { ProductService } from "../../../../services/product/product.service";
import { AlertService } from "../../../../services/alert/alert.service";
import { LoadingService } from "../../../../services/loading.service";
import { StorageService } from "../../../../services/storage/storage.service";
import { environment } from "../../../../../environments/environment";
import { TestObject } from "protractor/built/driverProviders";

@Component({
    selector: 'edit-product',
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

    public product: any = {};

    public image: { fileItem: FileItem, image: any };

    public token = this.storageService.getAuthToken();
    public uploader: FileUploader = new FileUploader({
        headers: [{ name: 'Authorization', value: "Bearer " + this.token }]
    });

    constructor(
        private router: Router,
        private route: ActivatedRoute,
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

        this.route.params.subscribe(params => {
            let productId = params['productId'];
            this.fetchProduct(productId);
          });
    }

    private fetchProduct(productId) {
        this.loadingService.show();
        this.productService.getProduct(productId).subscribe(res => {
            this.product = res.product;
            this.loadingService.hide();
        }, err => {
            this.alertService.alertError('Failed to fetch product');
            this.loadingService.hide();
            this.router.navigate(['products']);
        });
    }

    public clearImage() {
        this.uploader.clearQueue();
        this.image = null;
        this.product.imagePath = '';
    }
    
    public onProductSubmit() {
        this.loadingService.show();

        this.productService.updateProduct(this.product).subscribe(res => {
            
            this.product = res.product;

            if (this.image) {
                this.uploader.uploadItem(this.image.fileItem);
                this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
                    if (status == 200) {
                        this.image = null;
                        this.product = JSON.parse(response).product;
                        this.alertService.alertSuccess("Update Successful");
                    } else {
                        this.alertService.alertError("An unexpected error occurred, please try again later");
                    }
                    this.loadingService.hide();
                };
            } else {
                this.loadingService.hide();
                this.alertService.alertSuccess("Update Successful");
            }
            
        }, err => {
            this.alertService.alertError(err._body || "An unexpected error occurred, please try again later");
            this.loadingService.hide();
        });

        return false;
    }
}
