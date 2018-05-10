import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AgmCoreModule } from '@agm/core';

import { MaterializeModule } from "angular2-materialize";

// shared Module
import { SharedModule } from '../shared/shared.module';

// Guard Module
import { AuthGuard } from '../shared/guards/auth.guard';

import { HomeComponent } from './home.component';

export const ROUTES: Routes =[
  { path:'', component: HomeComponent  }
];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    MaterializeModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    SharedModule,
    AgmCoreModule
  ]
})
export class HomeModule {}