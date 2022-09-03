import {SessionService} from '@/_services/session.service';
import {Component, Input, OnInit} from '@angular/core';
import {PillData} from '@/_model/pill-data';
import {ColorData} from '@/_model/color-data';
import {Log} from '@/_services/log.service';
import {DialogResultButton, DialogType, IDialogDef} from '@/_model/dialog-data';

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

  orgPill: string;

  shapeList = PillData.shapeList;

  constructor(public ss: SessionService) {
  }

  get styleForPill(): any {
    return {'background-color': this.pill.color.display, 'color': this.pill.color.fontDisplay};
  };

  get classForPill(): string[] {
    const ret: string[] = [];
    if (this.pill == null) {
      return ret;
    }
    ret.push(this.pill.shape);
    this.fillSplit(ret);
    return ret;
  }

  fillSplit(ret: string[]): void {
    if (this.pill.splith === true) {
      ret.push('splith');
    }
    if (this.pill.splitv === true) {
      ret.push('splitv');
    }
  }

  classForShape(shape: string): string[] {
    const ret: string[] = [shape];
    if (this.pill.shape === shape) {
      this.fillSplit(ret);
    }
    return ret;
  }

  ngOnInit(): void {
  }

  clickCard(event: MouseEvent) {
    event.preventDefault();

  }

  clickSave(event: MouseEvent) {
    event.preventDefault();
    if ((this.pill?.name?.trim() || '') === '') {
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
          this.ss.data.listMedication.splice(this.idx, 1);
          this.ss.save();
          this.pill.isEdit = false;
        }
      });
    } else {
      this.ss.save();
      this.pill.isEdit = false;
    }
  }

  clickEdit(event: MouseEvent) {
    event.preventDefault();
    this.orgPill = this.pill.asString;
    this.pill.isEdit = true;
  }

  clickDelete(event: MouseEvent) {
    event.preventDefault();
    this.ss.confirm($localize`Soll das Medikament wirklich gelöscht werden?`).subscribe(result => {
      if (result.btn === DialogResultButton.yes) {
        this.ss.data.listMedication.splice(this.idx, 1);
        this.ss.save();
      }
    });
  }

  clickCancel(event: MouseEvent) {
    event.preventDefault();
    this.pill.fillFromString(this.orgPill);
    if ((this.pill?.name?.trim() || '') === '') {
      this.ss.data.listMedication.splice(this.idx, 1);
    }
    this.pill.isEdit = false;
  }

  clickShape(event: MouseEvent, shape: string) {
    event.preventDefault();
    if (this.pill.shape === shape) {
      this.pill.splitv = !this.pill.splitv;
      if (!this.pill.splitv) {
        this.pill.splith = !this.pill.splith;
      }
    } else {
      this.pill.shape = shape as any;
    }
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

  onColorSelected(color: ColorData) {
    this.pill.color = color;
    Log.info(`${this.pill.color}`);
  }

  onColorFileLoaded(content: any) {
    this.ss.data.colorImage = content;
    this.ss.save();
  }
}
