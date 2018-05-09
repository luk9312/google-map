import { NgModule } from '@angular/core';

import { ModelComponent } from './model.component';
import { HeatmapComponent } from './Heatmap/heatmap.component';

import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ModelComponent,
    HeatmapComponent
  ],
  providers: [
  ]
})
export class ModelModule {}