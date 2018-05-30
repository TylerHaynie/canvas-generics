import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OrbitalViewerComponent } from './components/orbital-viewer/orbital-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    OrbitalViewerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
