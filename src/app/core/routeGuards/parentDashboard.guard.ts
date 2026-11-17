import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';
import { ParentDashboardService } from '../../services';

@Injectable({ providedIn: 'root' })
export class ParentDashboardGuard implements CanActivate {
  constructor(private parentService: ParentDashboardService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.parentService.hasParentAccess()) {
      return true;
    }

    return this.router.createUrlTree(['/student/parent-unlock']);
  }
}