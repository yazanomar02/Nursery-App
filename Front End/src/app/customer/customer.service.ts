import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICustomer } from './customer';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customerApiUrl: string = "https://localhost:7201/api/Customer";

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<ICustomer[]> {
    return this.http.get<ICustomer[]>("https://localhost:7201/api/Customer?pageNumber=1&pageSize=10&isInclude=true")
                                      .pipe(
                                      tap(data => console.log(JSON.stringify(data))),
                                      catchError(this.handleError));
  }

  updateCustomer(id: string, data: any) {
    return this.http.put(`${this.customerApiUrl}/${id}`, data);
  }

  deleteCustomer(id: string) {
    return this.http.delete(`${this.customerApiUrl}/${id}`);
  }

  addCustomer(data: any){
    return this.http.post(`${this.customerApiUrl}`, data);
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
