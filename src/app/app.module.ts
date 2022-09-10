import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MainComponent} from './components/main/main.component';
import {LogComponent} from './components/log/log.component';
import {HttpClientModule} from '@angular/common/http';
import {PillmanComponent} from './components/pillman/pillman.component';
import {PillViewComponent} from './components/pill-view/pill-view.component';
import {ColorPickerComponent} from './controls/color-picker/color-picker.component';
import {DialogComponent} from './components/dialog/dialog.component';
import {AutofocusDirective} from './_directives/autofocus.directive';
import {LogPipe} from './components/log/log.pipe';
import {TimePickerComponent} from './controls/time-picker/time-picker.component';
import {NumberPickerComponent} from './controls/number-picker/number-picker.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import {PillEditComponent} from './components/pill-edit/pill-edit.component';
import {HelpComponent} from './components/help/help.component';
import {ColorPickerImageComponent} from './controls/color-picker/color-picker-image/color-picker-image.component';
import {ColorPickerDialog} from '@/controls/color-picker/color-picker-dialog';
import {ColorPickerMixerComponent} from './controls/color-picker/color-picker-mixer/color-picker-mixer.component';
import {ColorPickerBaseComponent} from '@/controls/color-picker/color-picker-base.component';

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
    PillEditComponent,
    HelpComponent,
    ColorPickerImageComponent,
    ColorPickerMixerComponent,
    ColorPickerBaseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
