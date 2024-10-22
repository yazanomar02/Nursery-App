import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ISapling } from './sapling';
import { INursery } from '../nursary/nursery';

@Injectable({
  providedIn: 'root'
})
export class SaplingService {
  saplingAoiUrl : string = "https://localhost:7201/api/Sapling";

  constructor(private http: HttpClient) { }

  getSaplins(nurseryId : string = "non") : Observable<ISapling[]>{
   if(nurseryId === 'non'){
    return this.http.get<ISapling[]>("https://localhost:7201/api/Sapling/?pageNumber=1&pageSize=10&isInclude=true")
    .pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError));
   }else{  
      return this.http.get<ISapling[]>(`${this.saplingAoiUrl}/?pageNumber=1&pageSize=10&isInclude=true&NurseryId=${nurseryId}`)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError));
   }
  }
  
  updateSapling(id : string , data : any){
    return this.http.put(`${this.saplingAoiUrl}/${id}`, data);
  }
  
  deleteSapling(id: string) {
    return this.http.delete(`${this.saplingAoiUrl}/${id}`);
  }

  addSapling(data: any) {
    return this.http.post(`${this.saplingAoiUrl}`, data);
  }

  getSaplingsforNurseryActive(nurseryId: string): Observable<ISapling[]> {
    return this.http.get<INursery>(`https://localhost:7201/api/Nursery/${nurseryId}?isInclude=true`).pipe(
      map(nursery => nursery.saplings)
    );
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
