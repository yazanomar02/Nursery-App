import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ICategory } from './category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categorygAoiUrl : string = "https://localhost:7201/api/Category";

  constructor(private http: HttpClient) { }
  getCategorys() : Observable<ICategory[]>{
    return this.http.get<ICategory[]>("https://localhost:7201/api/Category/?pageNumber=1&pageSize=10&isInclude=true")
    .pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError));
  }

  getCategory(id: string): Observable<ICategory> {
    return this.http.get<ICategory>(`${this.categorygAoiUrl}/${id}`);
  }
  
  updateCategory(id : string , data : any){
    return this.http.put(`${this.categorygAoiUrl}/${id}`, data);
  }

  deleteCategory(id: string) {
    return this.http.delete(`${this.categorygAoiUrl}/${id}`);
  }

  addCategory(data: any) {
    return this.http.post(`${this.categorygAoiUrl}`, data);
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
