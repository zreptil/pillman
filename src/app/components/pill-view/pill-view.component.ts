import {SessionService} from '@/_services/session.service';
import {Component, Input, OnInit} from '@angular/core';
import {PillData} from '@/_model/pill-data';
import {ColorData} from '@/_model/color-data';
import {Log} from '@/_services/log.service';
import {DialogResultButton} from '@/_model/dialog-data';

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

  onColorSelected(color: ColorData) {
    this.pill.color = color;
    Log.info(`${this.pill.color}`);
  }

  onColorFileLoaded(content: any) {
    if (content.length < 500000) {
      this.ss.data.colorImage = content;
      this.ss.save();
    }
  }
}
