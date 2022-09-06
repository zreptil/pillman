import {Component, Inject} from '@angular/core';
import {PillData} from '@/_model/pill-data';
import {SessionService} from '@/_services/session.service';
import {PillService} from '@/_services/pill.service';
import {DialogResultButton, DialogType, IDialogDef} from '@/_model/dialog-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export class PillDialogData {
  pill: PillData;
}

@Component({
  selector: 'app-pill-edit',
  templateUrl: './pill-edit.component.html',
  styleUrls: ['./pill-edit.component.scss',
    '../pill-view/pill-view.component.scss']
})
export class PillEditComponent {
  orgPill: string;
  shapeList = PillData.shapeList;
  alertList = PillData.alertList;
  alertTextList = PillData.alertTextList;
  dowShortNames = $localize`Mo|Di|Mi|Do|Fr|Sa|So`.split('|');

  constructor(public ss: SessionService,
              public ps: PillService,
              public dialogRef: MatDialogRef<PillEditComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: PillDialogData) {
    this.orgPill = this.data.pill.asString;
  }

  clickDelete(event: MouseEvent) {
    event.preventDefault();
    this.ss.confirm($localize`Soll das Medikament wirklich gelöscht werden?`).subscribe(result => {
      if (result.btn === DialogResultButton.yes) {
        const idx = this.ss.data.listMedication.findIndex(p => p.name === this.data.pill.name);
        if (idx >= 0) {
          this.ss.data.listMedication.splice(idx, 1);
        }
        this.ss.save();
        this.dialogRef.close();
      }
    });
  }

  clickShape(event: MouseEvent, shape: string) {
    event.preventDefault();
    if (this.data.pill.shape === shape) {
      this.data.pill.splitv = !this.data.pill.splitv;
      if (!this.data.pill.splitv) {
        this.data.pill.splith = !this.data.pill.splith;
      }
    } else {
      this.data.pill.shape = shape as any;
    }
  }

  clickAlert(event: MouseEvent, alert: string) {
    this.data.pill.alertAnimation = alert;
  }

  clickAlertText(event: MouseEvent, alert: string) {
    this.data.pill.alertAnimationText = alert;
  }

  clickSave(event: MouseEvent) {
    event.preventDefault();
    if ((this.data.pill?.name?.trim() || '') === '') {
      const btns: IDialogDef = {
        type: DialogType.warning,
        title: $localize`Warnung`,
        buttons: [{
          title: $localize`Löschen`,
          result: {btn: DialogResultButton.ok}
        }, {
          title: $localize`Editieren`,
          result: {btn: DialogResultButton.cancel}
        }]
      }
      this.ss.ask([$localize`Ein Medikament ohne Namen wird nicht gespeichert.`,
        $localize`Soll das Medikament gelöscht werden, oder willst Du es weiter editieren?`], btns).subscribe(result => {
        if (result.btn === DialogResultButton.ok) {
          const idx = this.ss.data.listMedication.findIndex(p => p.name === '' || p.name == null);
          if (idx >= 0) {
            this.ss.data.listMedication.splice(idx, 1);
          }
          this.ss.save();
          this.dialogRef.close();
        }
      });
    } else if (this.ss.data.listMedication.find((m) => m.name.toLowerCase() === this.data.pill.name.toLowerCase() && m !== this.data.pill) != null) {
      this.ss.info([$localize`Ein Medikament mit diesem Namen gibt es schon in der Liste.`,
        $localize`Bitte gib einen anderen Namen ein.`]);
    } else {
      this.data.pill.lastConsumed = null;
      this.ss.save();
      this.dialogRef.close();
    }
  }

  onColorFileLoaded(content: any) {
    this.ss.data.colorImage = content;
    this.ss.save();
  }

  clickCancel(event: MouseEvent) {
    event.preventDefault();
    this.data.pill.fillFromString(this.orgPill);
    if ((this.data.pill?.name?.trim() || '') === '') {
      const idx = this.ss.data.listMedication.findIndex(p => p.name === '' || p.name == null);
      if (idx >= 0) {
        this.ss.data.listMedication.splice(idx, 1);
      }
    }
    this.dialogRef.close();
  }

  clickWeekday(event: MouseEvent, idx: number) {
    event.preventDefault();
    this.data.pill.dowActive[idx] = !this.data.pill.dowActive[idx];
  }

  classForWeekday(idx: number): string[] {
    const ret = [];
    if (this.data.pill.dowActive[idx]) {
      ret.push('mark');
    }
    return ret;
  }
}
