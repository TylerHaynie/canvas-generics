import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { scene01Component } from './scenes/scene01/scene01.component';
import { Scene02Component } from './scenes/scene02/scene02.component';
import { Scene03Component } from './scenes/scene03/scene03.component';
import { Scene04Component } from './scenes/scene04/scene04.component';

@NgModule({
  declarations: [
    AppComponent,
    scene01Component,
    Scene02Component,
    Scene03Component,
    Scene04Component
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
