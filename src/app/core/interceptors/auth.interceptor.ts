import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    if (!req.url.includes('www.googleapis.com')) {
        const token = localStorage.getItem('token');
        const deviceId = localStorage.getItem('ora_device_id');

        const authReq = req.clone({
            setHeaders: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(deviceId ? { deviceId } : {})
            }
        });
        return next(authReq);
    } else {
        return next(req);
    }

};