import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  EditProductModel,
  NewProductModel,
  SearchProductModel,
} from './product.model';

const USER_API = environment.USER_API;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  newProduct(form: NewProductModel): Observable<any> {
    return this.http.post(`${USER_API}product`, form, httpOptions);
  }

  editProduct(form: EditProductModel): Observable<any> {
    return this.http.put(`${USER_API}product`, form, httpOptions);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${USER_API}product/${id}`, httpOptions);
  }

  getProductByCode(code: string): Observable<any> {
    return this.http.get(`${USER_API}product/${code}`, {
      responseType: 'json',
    });
  }

  getAllProduct(): Observable<any> {
    return this.http.get(`${USER_API}product`, { responseType: 'json' });
  }

  getAllStock(): Observable<any> {
    return this.http.get(`${USER_API}stock`, { responseType: 'json' });
  }

  cutProductStock(form: SearchProductModel[]): Observable<any> {
    return this.http.put(`${USER_API}stock`, form, httpOptions);
  }

  generateBarcode(form: any): Observable<any> {
    return this.http.post(`${USER_API}generate`, form, httpOptions);
  }
}
