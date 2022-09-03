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

  @Input()
  speak = false;

  constructor(public ss: SessionService) {
  }

  get isEditingPill(): boolean {
    return this.ss.data.listMedication.find(p => p.isEdit) != null;
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
