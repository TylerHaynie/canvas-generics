import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { scene01Component } from './scenes/scene01/scene01.component';
import { Scene02Component } from './scenes/scene02/scene02.component';

@NgModule({
  declarations: [
    AppComponent,
    scene01Component,
    Scene02Component
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
