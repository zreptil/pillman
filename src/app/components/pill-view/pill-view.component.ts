import {SessionService} from '@/_services/session.service';
import {Component, Input, OnInit} from '@angular/core';
import {PillData} from '@/_model/pill-data';

@Component({
  selector: 'app-pill-view',
  templateUrl: './pill-view.component.html',
  styleUrls: ['./pill-view.component.scss']
})
export class PillViewComponent implements OnInit {

  @Input()
  pill: PillData;

  orgPill: string;

  constructor(public ss: SessionService) {
  }

  get styleForPill(): any {
    return {'background-color': '#fff'};
  };

  get classForPill(): string[] {
    const ret: string[] = [];
    ret.push(this.pill?.shape);
    return ret;
  }

  ngOnInit(): void {
  }

  clickCard(event: MouseEvent) {
    event.preventDefault();

  }

  clickSave(event: MouseEvent) {
    event.preventDefault();
    this.ss.save();
    this.pill.isEdit = false;
  }

  clickEdit(event: MouseEvent) {
    event.preventDefault();
    this.orgPill = this.pill.asString;
    this.pill.isEdit = true;
  }

  clickCancel(event: MouseEvent) {
    event.preventDefault();
    this.pill = PillData.fromString(this.orgPill);
  }

  clickShape(event: MouseEvent, shape: string) {
    event.preventDefault();
    this.pill.shape = shape as any;
  }

  clickMissed(event: MouseEvent) {
    event.preventDefault();
    this.pill.setNextConsume();
  }

  clickEat(event: MouseEvent) {
    event.preventDefault();
    if (this.pill.supply > 0) {
      this.pill.supply -= this.pill.count;
    }
    this.pill.setNextConsume();
  }
}
