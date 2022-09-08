import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ColorData} from '@/_model/color-data';
import {MatDialog} from '@angular/material/dialog';
import {ColorPickerDialog} from '@/controls/color-picker/color-picker-dialog';

export interface ColorDialogData {
  imageDataUrl: string;
  mode: string;
  onDataChanged: EventEmitter<ColorDialogData>;
  color: ColorData;
  colorChange: EventEmitter<ColorData>;
  maxFilesize: number;
  savedColors: ColorData[];
}

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  @Output()
  onDataChanged = new EventEmitter<ColorDialogData>();

  @Input()
  imageDataUrl: string;

  @Input()
  mode: string;

  @Input()
  color: ColorData;

  @Output()
  colorChange = new EventEmitter<ColorData>();

  @Input()
  maxFilesize = 1000000;

  @Input()
  savedColors: ColorData[];

  constructor(public dialog: MatDialog) {
  }

  clickActivate(_: MouseEvent) {
    this.dialog.open(ColorPickerDialog, {
      data: {
        imageDataUrl: this.imageDataUrl,
        onDataChanged: this.onDataChanged,
        color: this.color || new ColorData([255, 255, 255]),
        colorChange: this.colorChange,
        maxFilesize: this.maxFilesize,
        savedColors: this.savedColors ?? [],
        mode: this.mode
      }
    })
  }
}
