import {Component, OnInit} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {PillData} from '@/_model/pill-data';
import {PillService} from '@/_services/pill.service';
import {Utils} from '@/classes/utils';
import {TimelineData} from '@/_model/timeline-data';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  viewTimer: any;
  // Methode im Timer sorgt dafür, dass die UI neu gezeichnet wird.
  now = Utils.getTime();

  constructor(public ss: SessionService,
              public ps: PillService) {
  }

  get modeIcon(): string {
    const list: { [key: string]: string } = {
      view: 'schedule',
      edit: 'edit',
      timeline: 'timelapse'
    };
    return list[this.ss.data.appMode] ?? 'help';
  }

  get listMedication(): PillData[] {
    return this.ss.data.listMedication.sort((a, b) => {
      if (a.time < b.time) {
        return -1;
      }
      if (a.time > b.time) {
        return 1;
      }
      return 0;
    })
  }

  get listTimeline(): TimelineData[] {
    const ret: TimelineData[] = [];
    let last: PillData = null;
    for (const pill of this.listMedication) {
      if (last == null || last.time !== pill.time) {
        ret.push(new TimelineData(pill, last?.time ?? 0));
      } else {
        ret[ret.length - 1].pills.push(pill);
      }
      last = pill;
    }
    return ret;
  }

  get styleForCurrentmark(): any {
    return this.styleForTimemark(Utils.getTime() / 60);
  }

  styleForTimemark(time: number): any {
    const width = time * 60 / (24 * 60) * 90;
    return {'left': `${width}%`};
  }

  styleForTimetext(time: number): any {
    const left = time * 60 / (24 * 60) * 90;
    return {'left': `calc(${left}% - 1em)`};
  };

  styleForTimeline(value: { timeDiff: number }): any {
    const width = value.timeDiff / (24 * 60) * 90;
    return {'width': `${width}%`};
  };

  ngOnInit(): void {
    this.initMode();
  }

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
    if (['view', 'timeline'].indexOf(this.ss.data.appMode) >= 0) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  clickMode(event: MouseEvent) {
    event.stopPropagation();
    this.ss.data.appMode = Utils.nextListItem(this.ss.data.appMode, ['view', 'timeline', 'edit']);
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
