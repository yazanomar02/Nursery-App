import { CanActivateFn } from '@angular/router';

export const userGardGuard: CanActivateFn = (route, state) => {
  const userRole  = localStorage.getItem('userRole')
  if(userRole){
    if(userRole === 'admin'){
      return true
    }else{
      return false
    }
  }
  return false;
};
