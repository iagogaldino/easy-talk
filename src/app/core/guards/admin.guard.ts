import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    }

    // Redirect to conversations if authenticated but not admin, otherwise to login
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/conversations']);
    } else {
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    }
    return false;
  }
}

