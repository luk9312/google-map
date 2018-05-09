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
      this.router.navigate(['/home']);
    } else {
      return this.elevationService.data$
        .map((data) => {
          if (!data) {
            this.router.navigate(['/home']);
          }
          return !!data;
        });
      }
    }
  }