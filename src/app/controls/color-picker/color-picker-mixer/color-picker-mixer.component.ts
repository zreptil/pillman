import {Component, OnInit} from '@angular/core';
import {ColorPickerBaseComponent} from '@/controls/color-picker/color-picker-base.component';

@Component({
  selector: 'app-color-picker-mixer',
  templateUrl: './color-picker-mixer.component.html',
  styleUrls: ['./color-picker-mixer.component.scss']
})
export class ColorPickerMixerComponent extends ColorPickerBaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
