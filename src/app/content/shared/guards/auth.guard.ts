import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import 'rxjs/add/operator/map';

import { ElevationService } from '../service/elevation.service';

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(
    private router: Router,
    private elevationService: ElevationService
  ) {}

  canActivate(){
    if (this.elevationService.data$ === null) {
      return this.router.navigate(['/home']);
    }
    return this.elevationService.data$
      .map((user) => {
        if (!user) {
          this.router.navigate(['/home']);
        }
        return !!user;
      });
    }
  }