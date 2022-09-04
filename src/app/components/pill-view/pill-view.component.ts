import {SessionService} from '@/_services/session.service';
import {Component, Input, OnInit} from '@angular/core';
import {PillData} from '@/_model/pill-data';
import {ColorData} from '@/_model/color-data';
import {Log} from '@/_services/log.service';
import {MatDialog} from '@angular/material/dialog';
import {PillService} from '@/_services/pill.service';

@Component({
  selector: 'app-pill-view',
  templateUrl: './pill-view.component.html',
  styleUrls: ['./pill-view.component.scss']
})
export class PillViewComponent implements OnInit {
  @Input()
  pill: PillData;

  @Input()
  idx: number;

  constructor(public dialog: MatDialog,
              public ss: SessionService,
              public ps: PillService) {
  }

  get classForContainer(): string[] {
    const ret = ['pill-container'];
    if (this.pill.isSupplyLow) {
      ret.push('low');
    }
    return ret;
  }

  get classForPill(): string[] {
    const ret: string[] = [];
    if (this.pill == null) {
      return ret;
    }
    if (this.ss.data.appMode === 'view') {
      if (this.pill.isAlarmed) {
        ret.push('alarm');
        ret.push(this.pill.alarmAnimation);
      }
    }
    ret.push(this.pill.shape);
    this.ps.fillSplit(this.pill, ret);
    return ret;
  }

  ngOnInit(): void {
  }

  clickCard(event: MouseEvent) {
    event.preventDefault();

  }

  clickMissed(event: MouseEvent) {
    event.preventDefault();
    this.pill.lastConsumed = new Date();
    this.pill.setNextConsume();
    this.ss.save();
  }

  clickEat(event: MouseEvent) {
    event.preventDefault();
    if (this.pill.supply > 0) {
      this.pill.supply -= this.pill.count;
    }
    this.pill.lastConsumed = new Date();
    this.pill.setNextConsume();
    this.ss.save();
  }

  clickTime(event: MouseEvent) {
    event.preventDefault();
    const list = {time: 'duration', duration: 'time'};
    this.ss.data.timeDisplay = list[this.ss.data.timeDisplay] as any;
    this.ss.save();
  }

  onColorSelected(color: ColorData) {
    this.pill.color = color;
    Log.info(`${this.pill.color}`);
  }

  clickEdit(event: MouseEvent) {
    event.preventDefault();
    this.ps.editPill(this.idx);
  }
}

