import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const basicAuth = 'Basic YWRtaW46YWRtaW4xMjM='; 
  
  const authReq = req.clone({
    setHeaders: {
      Authorization: basicAuth
    }
  });

  return next(authReq);
};