import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subscription, tap, throwError } from 'rxjs';
import { INursery } from './nursery';
import { ICompany } from '../company/company';

@Injectable({
  providedIn: 'root'
})
export class NursaryService {

  nursaryApiUrl: string = "https://localhost:7201/api/Nursery"
  
  constructor(private http: HttpClient) { }


  getNursaries(): Observable<INursery[]> {
    return this.http.get<INursery[]>(`${this.nursaryApiUrl}?pageNumber=1&pageSize=10&isInclude=true`)
                                      .pipe(
                                      tap(data => console.log(JSON.stringify(data))),
                                      catchError(this.handleError));
  }

  getNursery(id: string): Observable<INursery> {
    return this.http.get<INursery>(`${this.nursaryApiUrl}/${id}?isInclude=true`);
  }

  updateNursary(id: string, data: any) {
    return this.http.put(`${this.nursaryApiUrl}/${id}`, data);
  }

  deleteNursary(id: string) {
    return this.http.delete(`${this.nursaryApiUrl}/${id}`);
  }

  addNursary(data: any) {
    return this.http.post(`${this.nursaryApiUrl}`, data);
  }

  getNurseriesforCompanyActive(companyId: string): Observable<INursery[]> {
    return this.http.get<ICompany>(`https://localhost:7201/api/Company/${companyId}?isInclude=true`).pipe(
      map(company => company.nurseries)
    );
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
