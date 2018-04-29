import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ElevationService } from './elevation.service';
import { ModelService } from './Model/model.service';


import { AppComponent } from './app.component';
import { ModelComponent } from './Model/model.component';


import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';


@NgModule({
  declarations: [
    AppComponent,
    ModelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyChNp26bxuiShNlfPPoWsNlfXCZtCFeZEo',
      libraries: ['places', 'geometry']
    })
  ],
  providers: [
    ModelService,
    ElevationService,
    GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
