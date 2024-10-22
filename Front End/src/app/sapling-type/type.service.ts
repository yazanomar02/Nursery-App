import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ISaplingType } from './sapling-type';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  saplingTypeAoiUrl : string = "https://localhost:7201/api/SaplingType";

  constructor(private http: HttpClient) { }
  getSaplingTypes() : Observable<ISaplingType[]>{
    return this.http.get<ISaplingType[]>("https://localhost:7201/api/SaplingType/?pageNumber=1&pageSize=10&isInclude=true")
    .pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError));
  }
  updateSaplingType(id : string , data : any){
    return this.http.put(`${this.saplingTypeAoiUrl}/${id}`, data);
  }
  deleteSaplingType(id: string) {
    return this.http.delete(`${this.saplingTypeAoiUrl}/${id}`);
  }

  addSaplingType(data: any) {
    return this.http.post(`${this.saplingTypeAoiUrl}`, data);
  }

  private handleError(err: HttpErrorResponse){
    let errorMessage = "";

    if(err.error instanceof ErrorEvent){
       errorMessage= `Error: ${err.error.message}`;
    }

    else{
      errorMessage= `Server Error: ${err.message}`
    }

    console.error(errorMessage);

    return throwError(() => errorMessage);
  }
}
