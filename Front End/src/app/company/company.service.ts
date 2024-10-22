import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICompany } from './company';
import { catchError, delay, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companyApiUrl: string = "https://localhost:7201/api/Company"
  
  constructor(private http: HttpClient) { }


  getCompanies(): Observable<ICompany[]> {
    return this.http.get<ICompany[]>(`${this.companyApiUrl}?pageNumber=1&pageSize=10&isInclude=true`)
                                      .pipe(
                                      tap(data => console.log(JSON.stringify(data))),
                                      catchError(this.handleError));
  }

  getCompany(id: string): Observable<ICompany> {
    return this.http.get<ICompany>(`${this.companyApiUrl}/${id}`);
  }

  updateCompany(id: string, data: any) {
    return this.http.put(`${this.companyApiUrl}/${id}`, data);
  }

  deleteCompany(id: string) {
    return this.http.delete(`${this.companyApiUrl}/${id}`);
  }

  addCompany(data: any) {
    return this.http.post(`${this.companyApiUrl}`, data);
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
