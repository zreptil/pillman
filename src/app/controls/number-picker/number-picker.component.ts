import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.scss']
})
export class NumberPickerComponent implements OnInit {
  @Input()
  diff: number = 1;

  @Input()
  label: string;

  @Input()
  value!: number | string;

  @Input()
  max: number | string = 100;

  @Input()
  min: number | string = 0;

  @Output()
  valueChange = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
    if (this.value < this.min)
      this.value = this.min;
  }

  clickAdjust(diff: number) {
    let v = +this.value;
    v += +diff;
    while (v > +this.max) {
      v -= +this.max + +diff;
    }
    while (v < +this.min) {
      v += +this.max - +diff;
    }
    this.value = v;
    this.valueChange?.emit(this.value);
  }
}
