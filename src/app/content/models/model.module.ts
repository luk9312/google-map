import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from "angular2-materialize";

import { ModelComponent } from './model.component';
import { HeatmapComponent } from './Heatmap/heatmap.component';

import { SharedModule } from '../shared/shared.module';

export const ROUTES: Routes =[
  { path:'', component: ModelComponent}
];


@NgModule({
  imports: [
    MaterializeModule,
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    ModelComponent,
    HeatmapComponent
  ],
  providers: [
  ]
})
export class ModelModule {}