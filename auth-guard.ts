import { CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot,Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { PostService } from './post.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor( private authService: PostService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ):Observable<boolean> | Promise<boolean> | boolean {
      const isAuth = this.authService.getIsAuth();
      if(!isAuth){
        this.router.navigate(['/login']);
      }
      return isAuth;
    }
}
