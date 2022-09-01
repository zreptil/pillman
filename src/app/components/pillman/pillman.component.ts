import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-pillman',
  templateUrl: './pillman.component.html',
  styleUrls: ['./pillman.component.scss']
})
export class PillmanComponent implements OnInit {

  @Input()
  isDoc = false;

  constructor() {
  }

  get classForSvg(): string[] {
    const ret: string[] = [];
    if (this.isDoc)
      ret.push('doc');
    return ret;
  }

  ngOnInit(): void {
  }

}
