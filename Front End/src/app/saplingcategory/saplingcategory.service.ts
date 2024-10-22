import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ISaplingsCategory } from './saplingcategory';


@Injectable({
  providedIn: 'root'
})
export class SaplingcategoryService {
  saplingsCategoryApiUrl : string = "https://localhost:7201/api/SaplingsCategory";

  constructor(private http: HttpClient) { }
  getSaplingsCategorys() : Observable<ISaplingsCategory[]>{
    return this.http.get<ISaplingsCategory[]>("https://localhost:7201/api/SaplingsCategory/?pageNumber=1&pageSize=10&isInclude=true")
    .pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError));
  }
  getbyId(id : string) : Observable<ISaplingsCategory>{
    return this.http.get<ISaplingsCategory>(`${this.saplingsCategoryApiUrl}/${id}`)
  }



  updateSaplingsCategory(id : string , data : any){
    return this.http.put(`${this.saplingsCategoryApiUrl}/${id}`, data);
  }
  deleteSaplingsCategory(id: string) {
    return this.http.delete(`${this.saplingsCategoryApiUrl}/${id}`);
  }

  addSaplingsCategory(data: any) {
    return this.http.post(`${this.saplingsCategoryApiUrl}`, data);
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
