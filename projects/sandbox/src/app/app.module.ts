import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ComposeSceneComponent } from './scenes/compose-scene/compose-scene.component';
import { SpriteLoaderComponent } from './scenes/sprite-loader/sprite-loader.component';

@NgModule({
  declarations: [
    AppComponent,
    ComposeSceneComponent,
    SpriteLoaderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
