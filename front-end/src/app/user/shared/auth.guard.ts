import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  constructor(
    private router: Router,
    private auth: AuthService,
    private token: TokenService,
    private notify: NotifyService
  ) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.verifyLogin();
  }

  async verifyLogin() {
    let token = this.token.getToken();
    if (!token) {
      this.token.onLogout();
      this.notify.showNotify('error', 'No token provided!');
      this.router.navigate(['login']);
      return false;
    }

    await this.auth
      .isAuthentication()
      .toPromise()
      .catch((err) => {
        if (err.status == 500 || err.status == null)
          this.notify.showNotify('error', 'Error (500)! Bad request.');
        else this.notify.showNotify('error', err.error.message);

        this.token.onLogout();
        this.router.navigate(['login']);
        return false;
      });

    return true;
  }
}
