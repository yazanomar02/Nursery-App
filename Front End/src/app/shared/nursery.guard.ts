import { CanActivateFn } from '@angular/router';

export const nurseryGuard: CanActivateFn = (route, state) => {
  const userRole  = localStorage.getItem('userRole')
  if(userRole){
    if(userRole === 'nursery' || userRole === 'company' || userRole === 'admin'){
      return true
    }else{
      return false
    }
  }
  return false;
};
