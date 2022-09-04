import {Injectable} from '@angular/core';
import {PillData} from '@/_model/pill-data';
import {Utils} from '@/classes/utils';
import {SessionService} from '@/_services/session.service';
import {PillEditComponent} from '@/components/pill-edit/pill-edit.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class PillService {
  dialogRef: MatDialogRef<PillEditComponent>;

  constructor(public dialog: MatDialog,
              public ss: SessionService) {
  }

  get classForText(): string[] {
    return ['pulse'];
  }

  styleForPill(pill: PillData): any {
    return {'background-color': pill.color.display, 'color': pill.color.fontDisplay, 'align-self': 'flex-end'};
  };

  fillSplit(pill: PillData, ret: string[]): void {
    if (pill.splith === true) {
      ret.push('splith');
    }
    if (pill.splitv === true) {
      ret.push('splitv');
    }
  }

  classForShape(pill: PillData, shape: string): string[] {
    const ret: string[] = [shape];
    if (pill.shape === shape) {
      this.fillSplit(pill, ret);
    }
    if (shape === pill.shape) {
      ret.push('mark');
    }
    return ret;
  }

  classForAlarm(pill: PillData, alarm: string): string[] {
    const ret = [pill.shape];
    this.fillSplit(pill, ret);
    ret.push('alarm');
    ret.push(alarm);
    if (alarm === pill.alarmAnimation) {
      ret.push('mark');
    }
    return ret;
  }

  showSupplyLow(pill: PillData): boolean {
    return pill.isSupplyLow && (!pill.isAlarmed || this.ss.data.appMode == 'edit');
  }

  nextPillTime(pill: PillData): string {
    switch (this.ss.data.timeDisplay) {
      case 'duration':
        const now = new Date();
        const time = now.getHours() * 60 + now.getMinutes();
        const duration = pill.time - time;
        return Utils.fmtDuration(duration);
    }
    return Utils.fmtTime(pill.time);
  }

  showPill(pill: PillData): boolean {
    if (this.ss.data.appMode == 'edit') {
      return true;
    }
    if (Utils.isToday(pill.nextConsume)) {
      return true;
    }
    return pill.isSupplyLow;
  }

  editPill(idx: number): void {
    this.dialogRef = this.dialog.open(PillEditComponent, {
      minWidth: '50%',
      data: {
        pill: this.ss.data.listMedication[idx],
        idx: idx
      },
      disableClose: true
    });
    // this.dialogRef.afterClosed().subscribe(result => {
    // });
  }
}
