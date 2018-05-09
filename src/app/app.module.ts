import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from './shared/shared.module';
import { AuthGuard } from './shared/guards/auth.guard';


import { AppComponent } from './app.component';


import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

export const ROUTES: Routes =[
  { path:'', pathMatch: 'full', component: AppComponent},
  { path:'model', canActivate: [AuthGuard], loadChildren:'./model/model.module#ModelModule'}
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    SharedModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyChNp26bxuiShNlfPPoWsNlfXCZtCFeZEo',
      libraries: ['places', 'geometry']
    })
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
