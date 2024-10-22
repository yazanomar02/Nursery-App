import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ISector } from './sector';
import { INursery } from '../nursary/nursery';
import { ICompany } from '../company/company';

@Injectable({
  providedIn: 'root'
})
export class SectorService {
  sectorApiUrl: string = "https://localhost:7201/api/Sector"
  
  constructor(private http: HttpClient) { }


  getSectors(): Observable<ISector[]> {
    return this.http.get<ISector[]>(`${this.sectorApiUrl}`)
                                      .pipe(
                                      tap(data => console.log(JSON.stringify(data))),
                                      catchError(this.handleError));
  }

  updateSector(id: string, data: any) {
    return this.http.put(`${this.sectorApiUrl}/${id}`, data);
  }

  deleteSector(id: string) {
    return this.http.delete(`${this.sectorApiUrl}/${id}`);
  }

  addSector(data: any) {
    return this.http.post(`${this.sectorApiUrl}`, data);
  }

  getSectorsforNurseryActive(nurseryId: string): Observable<ISector[]> {
    return this.http.get<INursery>(`https://localhost:7201/api/Nursery/${nurseryId}?isInclude=true`).pipe(
      map(nursery => nursery.sectors)
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
