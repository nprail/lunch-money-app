import { AuthService } from './auth.service'
import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
} from '@angular/router'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  checkAuth(): boolean {
    if (this.auth.isLoggedIn) {
      return true
    } else {
      this.auth.logout()
      return false
    }
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable((observer) => {
      if (this.auth.loading) {
        this.auth.loading$.subscribe(() => {
          observer.next(this.checkAuth())
          observer.complete()
        })
      } else {
        observer.next(this.checkAuth())
        observer.complete()
      }
    })
  }
}
