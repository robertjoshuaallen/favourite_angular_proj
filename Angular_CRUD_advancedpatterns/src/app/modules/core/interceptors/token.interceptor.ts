import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { v4 as uuid4 } from 'uuid';
import { StorageKey, StorageService } from '~shared/services/storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) {}

  /**
   * @param request The initial request
   * @param next The http handler
   * @returns An Observable with the request modified
   */
  /**
   * @example
   * intercept(request, next)
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = { req_uuid: uuid4(), Authorization: '' };

    const token = this.storageService.getCookie(StorageKey.ACCESS_TOKEN);

    if (token && !request.headers.get('bypassAuthorization')) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const newRequest = request.clone({
      setHeaders: headers,
    });

    return next.handle(newRequest).pipe(catchError(err => observableThrowError(err)));
  }
}
