import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "../api/api.service";

@Injectable()
export class ProductService {

  constructor(private apiService: ApiService) {}

  public getProducts(): Observable<any> {
    return this.apiService.getJson('/product');
  }

  public getProduct(productId): Observable<any> {
      return this.apiService.getJson(`/product/${productId}`);
  }

  public createProduct(product): Observable<any> {
    return this.apiService.postJson(`/product/`, product);
  }

  public updateProduct(product): Observable<any> {
    return this.apiService.postJson(`/product/update`, product);
  }
}
