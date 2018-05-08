import { NgModule } from '@angular/core';

import { ModelComponent } from './model.component';
import { HeatmapComponent } from './Heatmap/heatmap.component';
import { ModelService } from './model.service';

@NgModule({
  imports: [],
  declarations: [
    ModelComponent,
    HeatmapComponent
  ],
  providers: [
    ModelService
  ]
})
export class ModelModule {}