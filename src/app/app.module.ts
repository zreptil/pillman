import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MainComponent} from './components/main/main.component';
import {LogComponent} from './components/log/log.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import {PillmanComponent} from './components/pillman/pillman.component';
import {PillViewComponent} from './components/pill-view/pill-view.component';
import {ColorPickerComponent, ColorPickerDialog} from './controls/color-picker/color-picker.component';
import { DialogComponent } from './components/dialog/dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialModule
  ],
  declarations: [
    AppComponent,
    MainComponent,
    LogComponent,
    PillmanComponent,
    PillViewComponent,
    ColorPickerComponent,
    ColorPickerDialog,
    DialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
