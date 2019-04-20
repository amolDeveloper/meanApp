import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostService } from './post.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private postSer: PostService){}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.postSer.gettoken();
    const authRequest = req.clone({
      headers: req.headers.set('authorization', "Bearer " + token)
    });
    return next.handle(authRequest);
  }
}
