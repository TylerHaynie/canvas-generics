import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ElementTestComponent } from './scenes/element-test/element-test.component';
import { ParticleTestComponent } from './scenes/particle-test/particle-test.component';
import { RayTestComponent } from './scenes/ray-test/ray-test.component';
import { PolygonTestComponent } from './scenes/polygon-test/polygon-test.component';

@NgModule({
  declarations: [
    AppComponent,
    ElementTestComponent,
    ParticleTestComponent,
    RayTestComponent,
    PolygonTestComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
