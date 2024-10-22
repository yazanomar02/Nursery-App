import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { IOrder } from './order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderApiUrl: string = "https://localhost:7201/api/Order";

  constructor(private http: HttpClient) { }

  getOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>("https://localhost:7201/api/Order?pageNumber=1&pageSize=10&isInclude=true")
                                      .pipe(
                                      tap(data => console.log(JSON.stringify(data))),
                                      catchError(this.handleError));
  }
  //https://localhost:7201/api/Order/2b55739b-a2e3-47c4-92e1-cb98db6c7e1a?isInclude=true
  getOrder(id : string) : Observable<IOrder>{
    return this.http.get<IOrder>(`${this.orderApiUrl}/${id}?isInclude=true`);
  }
  updateOrder(id: string, data: any) {
    return this.http.put(`${this.orderApiUrl}/${id}`, data);
  }

  deleteOrder(id: string) {
    return this.http.delete(`${this.orderApiUrl}/${id}`);
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
