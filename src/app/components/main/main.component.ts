import {Component, OnInit} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {PillData} from '@/_model/pill-data';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(public ss: SessionService) {
  }

  get modeIcon(): string {
    const list = {view: 'schedule', edit: 'edit'};
    return list[this.ss.data.appMode];
  }

  ngOnInit(): void {
  }

  showPill(_: PillData): boolean {
    return true;
  }

  clickMode(event: MouseEvent) {
    event.stopPropagation();
    const list = {view: 'edit', edit: 'view'};
    this.ss.data.appMode = list[this.ss.data.appMode] as any;
    this.ss.save();
  }

  clickCross(event: MouseEvent) {
    event.stopPropagation();
    const pill = new PillData();
    pill.isEdit = true;
    this.ss.data.listMedication.push(pill);
    this.ss.save();
  }

  clickPillman() {
    this.ss.data.showHelp = !this.ss.data.showHelp;
    this.ss.save();
  }
}
