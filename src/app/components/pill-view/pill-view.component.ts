import {SessionService} from '@/_services/session.service';
import {Component, Input, OnInit} from '@angular/core';
import {ColorData} from '@/_model/color-data';
import {Log, LogService} from '@/_services/log.service';
import {MatDialog} from '@angular/material/dialog';
import {PillService} from '@/_services/pill.service';
import {Utils} from '@/classes/utils';
import {PillData} from '@/_model/pill-data';
import {TimeData} from '@/_model/time-data';
import {PillmanData} from '@/_model/pillman-data';

@Component({
  selector: 'app-pill-view',
  templateUrl: './pill-view.component.html',
  styleUrls: ['./pill-view.component.scss']
})
export class PillViewComponent implements OnInit {
  @Input()
  pill: PillData;
  @Input()
  time: TimeData;

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
    if (['timeline'].indexOf(this.ss.data.appMode) >= 0) {
      if (this.time.isAlerted) {
        ret.push('alert');
        ret.push(this.pill.alertAnimation);
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
    this.ps.stopAudio();
    this.time.lastConsumed = new Date();
    this.time.setNextConsume();
    this.ss.save();
    LogService.refreshUI();
  }

  clickEat(event: MouseEvent) {
    event.preventDefault();
    this.ps.stopAudio();
    if (this.pill.supply > 0) {
      this.pill.supply -= this.time.count;
    }
    this.time.lastConsumed = new Date();
    this.time.setNextConsume();
    this.ss.save();
    LogService.refreshUI();
  }

  clickTime(event: MouseEvent) {
    event.preventDefault();
    this.ss.data.timeDisplay = Utils.nextListItem(this.ss.data.timeDisplay, PillmanData.timeList);
    this.ss.save();
    LogService.refreshUI();
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
