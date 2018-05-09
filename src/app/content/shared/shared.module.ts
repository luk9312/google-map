import { NgModule, ModuleWithProviders } from '@angular/core';

// component

// services
import { ElevationService } from './service/elevation.service';


// guards
import { AuthGuard } from './guards/auth.guard';


@NgModule({
  imports: [
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ElevationService,
        AuthGuard
      ]
    }
  }
}