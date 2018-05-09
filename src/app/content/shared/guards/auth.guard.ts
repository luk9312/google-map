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
    // let data = this.elevationService.dataSet
    // if (data || data !==40000) {
    //   return false;
    // }
    // return true;
    return true;
  }
}