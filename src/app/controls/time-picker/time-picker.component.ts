import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Utils} from '@/classes/utils';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Input()
  minuteDiff: number = 1;

  @Input()
  label: string;

  @Input()
  value!: number | string;

  @Output()
  valueChange = new EventEmitter<number>();

  constructor() {
  }

  get time(): string {
    return Utils.fmtTime(+this.value);
  }

  ngOnInit(): void {
  }

  clickTimeAdjust(diff: number) {
    let v = +this.value;
    v += +diff;
    while (v >= 24 * 60) {
      v -= 24 * 60;
    }
    while (v < 0) {
      v += 24 * 60;
    }
    this.value = v;
    this.valueChange?.emit(this.value);
  }
}
