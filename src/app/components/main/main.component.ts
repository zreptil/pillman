import {Component, OnInit} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {PillData} from '@/_model/pill-data';
import {Utils} from '@/classes/utils';
import {PillService} from '@/_services/pill.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  viewTimer: any;

  constructor(public ss: SessionService,
              public ps: PillService) {
  }

  get modeIcon(): string {
    const list = {view: 'schedule', edit: 'edit'};
    return list[this.ss.data.appMode];
  }

  ngOnInit(): void {
    this.initMode();
  }

  showPill(pill: PillData): boolean {
    if (this.ss.data.appMode == 'edit') {
      return true;
    }
    return Utils.isToday(pill.nextConsume);
  }

  // Der Timer wird einfach nur gestartet. Schon der Aufruf dieser
  // Methode im Timer sorgt dafür, dass die UI neu gezeichnet wird.
  onViewTimer(): void {
    this.startTimer();
  }

  startTimer(): void {
    if ((this.ss.data.listMedication?.length || 0) === 0) {
      return;
    }
    const now = new Date();
    const timeout = 60000 - now.getSeconds() * 1000;
    this.viewTimer = setTimeout(() => {
      this.onViewTimer();
    }, timeout);
  }

  stopTimer(): void {
    clearTimeout(this.viewTimer);
  }

  initMode(): void {
    if (this.ss.data.appMode === 'view') {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  clickMode(event: MouseEvent) {
    event.stopPropagation();
    const list = {view: 'edit', edit: 'view'};
    this.ss.data.appMode = list[this.ss.data.appMode] as any;
    this.initMode();
    this.ss.save();
  }

  clickCross(event: MouseEvent) {
    event.stopPropagation();
    const pill = new PillData();
    this.ss.data.listMedication.push(pill);
    this.ss.save();
    this.ps.editPill(this.ss.data.listMedication.length - 1);
  }

  clickPillman() {
    this.ss.data.showHelp = !this.ss.data.showHelp;
    this.ss.save();
  }
}
