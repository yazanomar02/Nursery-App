import { CanActivateFn } from '@angular/router';

export const companyGuard: CanActivateFn = (route, state) => {
  const userRole  = localStorage.getItem('userRole')
  if(userRole){
    if(userRole === 'company' || userRole === 'admin'){
      return true
    }else{
      return false
    }
  }
  return false;
};
