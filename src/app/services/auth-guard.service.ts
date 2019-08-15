import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class NoAuthGuardService implements CanActivate {
  constructor(private router: Router, private authService:AuthService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      return true
    } else {
      this.authService.refreshData()
      this.router.navigate(['/']);
      return false;
    }
  }

}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService:AuthService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true
    } else {
      console.log('AuthGuard: Login not detected - routing to login.');
      this.authService.refreshData()

      // get the base path
      let path = `/${route.url.join('/')}`

      // handle params
      let paramLength = Object.keys(route.queryParams).length
      if (paramLength > 0) {
        path = `${path}?`
      }

      // Iterate through any params which may also be in the url
      let i = 0
      for (var key in route.queryParams) {
        if (route.queryParams.hasOwnProperty(key)) {
          i++
          let param = key + "=" + route.queryParams[key]
          path = `${path}${param}`
          if (i < paramLength) {
            path = `${path}&`
          }
        }
      }
      localStorage.setItem("authRedirect", path)
      this.router.navigate(['/login']);
      return false;
    }
  }
}

@Injectable()
export class MemberAuthGuardService implements CanActivate {
  constructor(private router: Router, private authService:AuthService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      let isMember:boolean  = (this.authService.hasClaim(0)) ? true : false
      if (isMember) {
        return true
      } else {
        this.router.navigate(['/apply']);
        return false
      }
    } else {
      this.authService.refreshData()
      this.router.navigate(['/login']);
      return false;
    }
  }
}

// @Injectable()
// export class RoleRequiredAuthGuardService implements CanActivate {
//   constructor(public roleId:number, private router: Router, private authService:AuthService) { }
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     if (this.authService.isLoggedIn()) {
//       return (this.authService.hasClaim(this.roleId)) ? true : false
//     } else {
//       this.authService.refreshData()
//       this.router.navigate(['/login']);
//       return false;
//     }
//   }
// }
