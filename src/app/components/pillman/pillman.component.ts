import {Component, Input, OnInit} from '@angular/core';
import {SessionService} from '@/_services/session.service';

@Component({
  selector: 'app-pillman',
  templateUrl: './pillman.component.html',
  styleUrls: ['./pillman.component.scss']
})
export class PillmanComponent implements OnInit {

  @Input()
  isDoc = false;

  constructor(public ss: SessionService) {
  }

  get classForSvg(): string[] {
    const ret: string[] = [];
    if (this.isDoc) {
      ret.push('doc');
    }
    return ret;
  }

  ngOnInit(): void {
  }
}
