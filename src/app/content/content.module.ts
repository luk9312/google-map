import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// shared Module
import {SharedModule } from './shared/shared.module';

// Guard Module
import { AuthGuard } from './shared/guards/auth.guard';

import { AgmCoreModule } from '@agm/core';

export const ROUTES: Routes =[
  { path:'home', loadChildren: './home/home.module#HomeModule' },
  { path:'model', canActivate: [AuthGuard], loadChildren: './models/model.module#ModelModule' }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    SharedModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyChNp26bxuiShNlfPPoWsNlfXCZtCFeZEo',
      libraries: ['places', 'geometry']
    })
  ]
})
export class ContentModule {}