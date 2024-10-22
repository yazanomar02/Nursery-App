import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  baseUrl = 'https://localhost:7201/api'
  
  createUser(formData : any) {
   return this.http.post(this.baseUrl+'/user/register' , formData)
  }
  
  signin(formData : any) {
   return this.http.post(this.baseUrl+'/user/login' , formData)
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('userRole');
    if(role){
      if(role === 'admin'){
        return true;
      }else{
        return false
      }
    }
    return false;
  }
  isCompany(): boolean {
    const role = localStorage.getItem('userRole');
    if(role){
      if(role === 'company' ){
        return true;
      }else{
        return false
      }
    }
    return false;
  }
  isNursery(): boolean {
    const role = localStorage.getItem('userRole');
    if(role){
      if(role === 'nursery' ){
        return true;
      }else{
        return false
      }
    }
    return false;
  }

  setUserId(id: string) {
    if (id) {
      localStorage.setItem('userId', id); 
    }
  }
}

