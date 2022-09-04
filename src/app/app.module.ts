import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MainComponent} from './components/main/main.component';
import {LogComponent} from './components/log/log.component';
import {HttpClientModule} from '@angular/common/http';
import {PillmanComponent} from './components/pillman/pillman.component';
import {PillViewComponent} from './components/pill-view/pill-view.component';
import {ColorPickerComponent, ColorPickerDialog} from './controls/color-picker/color-picker.component';
import {DialogComponent} from './components/dialog/dialog.component';
import {AutofocusDirective} from './_directives/autofocus.directive';
import {LogPipe} from './components/log/log.pipe';
import {TimePickerComponent} from './controls/time-picker/time-picker.component';
import {NumberPickerComponent} from './controls/number-picker/number-picker.component';

import {FormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import {PillEditComponent} from './components/pill-edit/pill-edit.component';

@NgModule({
  declarations: [
    AutofocusDirective,
    LogPipe,
    AppComponent,
    MainComponent,
    LogComponent,
    PillmanComponent,
    DialogComponent,
    PillViewComponent,
    ColorPickerComponent,
    TimePickerComponent,
    NumberPickerComponent,
    PillEditComponent,
    ColorPickerDialog,
    PillEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
