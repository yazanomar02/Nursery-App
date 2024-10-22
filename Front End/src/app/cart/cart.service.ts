/*
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { ICart } from './cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartApiUrl: string = "https://localhost:7201/api/Carts";

  constructor(private http: HttpClient) { }

  addToCart(saplingId: string, quantity: number,userId : string , cartId: string = "non"): Observable<any> {
    if (cartId === "non") {
      return this.http.post(`${this.cartApiUrl}/AddItem?userId=${userId}&saplingId=${saplingId}&quantity=${quantity}`, {});
    } else {
      return this.http.post(`${this.cartApiUrl}/AddItem?cartId=${cartId}&userId=${userId}&saplingId=${saplingId}&quantity=${quantity}`, {});
    }
  }
  
  getCart(id : string) : Observable<ICart>{
    return this.http.get<ICart>(`${this.cartApiUrl}/${id}`)
  }
  confirm(id : string, discount : number = 0, userId: string){
    //https://localhost:7201/api/Carts/d6932f72-8846-42ea-ae80-e02bf694631b/ConfirmOrder?discount=0
    return this.http.post(`${this.cartApiUrl}/${id}/${userId}/ConfirmOrder?discount=${discount}`, {});
  }
  DeleteCartItem(cartId : string,cartItemId : string) : Observable<any>{
    //https://localhost:7201/api/Carts/RemoveItem/da147ede-e963-428d-ba21-4fd57038b111/630fd6a0-ba05-4edb-a30d-08d054a5c5ca
      return this.http.delete(`${this.cartApiUrl}/RemoveItem/${cartId}/${cartItemId}`)
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
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { ICart } from './cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartApiUrl: string = "https://localhost:7201/api/Carts";
  
  // BehaviorSubject لتخزين البيانات الحالية للسلة
  private cartSource = new BehaviorSubject<ICart | null>(null);
  cart$ = this.cartSource.asObservable(); // المكونات الأخرى يمكنها الاشتراك في هذا

  constructor(private http: HttpClient) { }

  addToCart(saplingId: string, quantity: number, userId: string, cartId: string = "non"): Observable<any> {
    const url = cartId === "non" 
      ? `${this.cartApiUrl}/AddItem?userId=${userId}&saplingId=${saplingId}&quantity=${quantity}`
      : `${this.cartApiUrl}/AddItem?cartId=${cartId}&userId=${userId}&saplingId=${saplingId}&quantity=${quantity}`;

    return this.http.post(url, {}).pipe(
      tap(() => this.getCart(cartId).subscribe()), // تحديث السلة بعد الإضافة
      catchError(this.handleError)
    );
  }
  
  getCart(id: string): Observable<ICart> {
    return this.http.get<ICart>(`${this.cartApiUrl}/${id}`).pipe(
      tap(cart => this.cartSource.next(cart)), // تحديث البيانات عند جلب السلة
      catchError(this.handleError)
    );
  }

  confirm(id: string, discount: number = 0, userId: string): Observable<any> {
    const url = `${this.cartApiUrl}/${id}/${userId}/ConfirmOrder?discount=${discount}`;
    return this.http.post(url, {}).pipe(
      catchError(this.handleError)
    );
  }

  DeleteCartItem(cartId: string, cartItemId: string): Observable<any> {
    const url = `${this.cartApiUrl}/RemoveItem/${cartId}/${cartItemId}`;
    return this.http.delete(url).pipe(
      tap(() => this.getCart(cartId).subscribe()), // تحديث السلة بعد الحذف
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = "";

    if (err.error instanceof ErrorEvent) {
      errorMessage = `Error: ${err.error.message}`;
    } else {
      errorMessage = `Server Error: ${err.message}`;
    }

    console.error(errorMessage);

    return throwError(() => new Error(errorMessage));
  }
}

@Injectable({
  providedIn: 'root'
})
export class CartIdService {
  private cartIdSubject = new BehaviorSubject<string | null>(this.getStoredCartId());

  private getStoredCartId(): string | null {
    return localStorage.getItem('cartId');
  }

  setCartId(cart: ICart | undefined) {
    if (cart) {
      const cartId = cart.id;
      localStorage.setItem('cartId', cartId); // حفظ الـ Cart ID في localStorage
      this.cartIdSubject.next(cartId);
    }
  }

  getCartId(): Observable<string | null> {
    return this.cartIdSubject.asObservable();
  }

  clearCartId() {
    localStorage.removeItem('cartId'); // مسح الـ Cart ID عند الحاجة
    this.cartIdSubject.next(null);
  }
}
