import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, take, tap, throwError } from 'rxjs';
import { ISupplier } from './supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  supplierApiUrl: string = "https://localhost:7201/api/Suppliers";

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<ISupplier[]> {
    return this.http.get<ISupplier[]>("https://localhost:7201/api/Suppliers?pageNumber=1&pageSize=10&isInclude=true")
                                      .pipe(
                                       tap(data => console.log(JSON.stringify(data))),
                                       catchError(this.handleError));
  }

  updateSupplier(id: string, data: any) {
    return this.http.put(`${this.supplierApiUrl}/${id}`, data);
  }

  deleteSupplier(id: string) {
    return this.http.delete(`${this.supplierApiUrl}/${id}`);
  }

  addSupplier(data: any) {
    return this.http.post(`${this.supplierApiUrl}`, data);
  }

  private handleError(err: HttpErrorResponse){
    let errorMessage = "";

    if(err.error instanceof ErrorEvent){
      // Client or Network Error
      errorMessage= `Error: ${err.error.message}`;
    }

    else{
      // Server Error
      errorMessage= `Server Error: ${err.message}`
    }

    console.error(errorMessage);

    return throwError(() => errorMessage);
  }
}
