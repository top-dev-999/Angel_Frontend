import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ApiService {

  public token = this.storageService.getAuthToken();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  public postJson(path, payload): Observable<any> {
    return this.http.post(environment.baseUrl + path, payload, {
      headers: this.getHeaders()
    });
  }

  public getJson(path): Observable<any> {
    return this.http.get(environment.baseUrl + path, {
      headers: this.getHeaders()
    });
  }

  public getFile(imageUrl): Observable<Blob> {
    return this.http.get(environment.baseUrl + imageUrl, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    const token = this.storageService.getAuthToken();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return headers;
  }

}
