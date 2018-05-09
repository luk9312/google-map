import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// feature modules
import { ContentModule } from './content/content.module';

// components
import { AppComponent } from './app.component';

// routes
export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ContentModule,
    RouterModule.forRoot(ROUTES),
    
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
