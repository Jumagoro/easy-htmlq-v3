import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StepService } from './step-service.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
      private stepService: StepService
    ) { }

    /**
     * Checks if the user is allowed to use the targeted module
     * @param route  Route the user accessing
     * @param state  Current router state
     * @returns True, if the user is allowed to access this route (step not deactivated)
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      let res = !(
        (route.url[0].path === 'step-1' && this.stepService.isStepDisabled(1)) ||
        (route.url[0].path === 'step-3' && this.stepService.isStepDisabled(3)) ||
        (route.url[0].path === 'step-4' && this.stepService.isStepDisabled(4))
      );

      return res;
    }
}