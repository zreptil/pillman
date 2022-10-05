import {Injectable} from '@angular/core';
import {PillData} from '@/_model/pill-data';
import {Utils} from '@/classes/utils';
import {SessionService} from '@/_services/session.service';
import {PillEditComponent} from '@/components/pill-edit/pill-edit.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TimeData} from '@/_model/time-data';
import {HelpData} from '@/_model/help-data';

@Injectable({
  providedIn: 'root'
})
export class PillService {
  audio = new Audio();
  isEditingPill = false;
  dialogRef: MatDialogRef<PillEditComponent>;
  isPlayingAudio = false;

  constructor(public dialog: MatDialog,
              public ss: SessionService) {
    this.audio.addEventListener('ended', () => {
      this.isPlayingAudio = false;
    });
  }

  classForText(pill: PillData): string[] {
    return [pill.alertAnimationText];
  }

  playAudio(name: string): void {
    if (name == null || name === '') {
      this.isPlayingAudio = false;
      return;
    }
    this.audio.src = `/assets/sound/${name}.mp3`;
    // it is also possible to provide a link to an mp3, maybe useful for later expansions
    // this.audio.src = `https://legacy.zreptil.de/waveling/mp3.fun/000001.mp3`;
    this.audio.load();
    this.audio.play();
    this.isPlayingAudio = true;
  }

  stopAudio(): void {
    this.audio.pause();
    this.isPlayingAudio = false;
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

  classForAlertText(pill: PillData, alert: string): string[] {
    const ret = [pill.shape];
    this.fillSplit(pill, ret);
    ret.push('alert');
    ret.push(alert);
    if (alert === pill.alertAnimationText) {
      ret.push('mark');
    }
    return ret;
  }

  classForAlert(pill: PillData, alert: string): string[] {
    const ret = [pill.shape];
    this.fillSplit(pill, ret);
    ret.push('alert');
    ret.push(alert);
    if (alert === pill.alertAnimation) {
      ret.push('mark');
    }
    return ret;
  }

  showSupplyLow(pill: PillData): boolean {
    return pill.isSupplyLow;
  }

  getDisplayTime(time: TimeData): string {
    switch (this.ss.data.timeDisplay) {
      case 'duration':
        const now = new Date();
        const t = now.getHours() * 60 + now.getMinutes();
        const duration = time.time - t;
        return Utils.fmtDuration(duration);
    }
    return Utils.fmtTime(time.time);
  }

  showPill(pill: PillData, time: TimeData): boolean {
    if (this.ss.data.appMode === 'edit') {
      return true;
    }
    if (Utils.isToday(time.nextConsume)) {
      return true;
    }
    return pill.isSupplyLow;
  }

  editPill(idx: number): void {
    this.isEditingPill = true;
    HelpData.set('hlp-editpill');
    this.dialogRef = this.dialog.open(PillEditComponent, {
      minWidth: '50%',
      data: {
        pill: this.ss.data.listMedication[idx],
        idx: idx
      },
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(_ => {
      this.isEditingPill = false;
      HelpData.clear('hlp-editpill');
    });
  }

  iconConsumed(pill: PillData): string {
    if (pill.shape === 'creme') {
      return 'clean_hands';
    }
    return 'restaurant';
  }

  iconMissed(pill: PillData): string {
    if (pill.shape === 'creme') {
      return 'do_not_touch';
    }
    return 'no_meals';
  }
}
