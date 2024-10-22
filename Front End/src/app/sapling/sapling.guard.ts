import { CanActivateFn } from '@angular/router';

export const saplingGuard: CanActivateFn = (route, state) => {
  const userRole  = localStorage.getItem('userRole')
  if(userRole){
    if(userRole === 'admin' || userRole === 'user' ||userRole === 'company' || userRole === 'nursery'){
      return true
    }else{
      return false
    }
  }
  return false;
};
