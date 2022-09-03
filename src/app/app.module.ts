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
import {DialogComponent} from './components/dialog/dialog.component';
import {AutofocusDirective} from './_directives/autofocus.directive';
import {LogPipe} from './components/log/log.pipe';
import { TimePickerComponent } from './controls/time-picker/time-picker.component';
import { NumberPickerComponent } from './controls/number-picker/number-picker.component';

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
    DialogComponent,
    AutofocusDirective,
    LogPipe,
    TimePickerComponent,
    NumberPickerComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
