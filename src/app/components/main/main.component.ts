import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {PillData} from '@/_model/pill-data';
import {PillService} from '@/_services/pill.service';
import {Utils} from '@/classes/utils';
import {TimelineData} from '@/_model/timeline-data';
import {PillmanData} from '@/_model/pillman-data';
import {saveAs} from 'file-saver';
import {Log} from '@/_services/log.service';
import {PillTimeData} from '@/_model/pill-time-data';
import {HelpData} from '@/_model/help-data';

class AlertData {
  label: string;
  name: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  viewTimer: any;
  @ViewChild('fileSelect')
  fileSelect: ElementRef<HTMLInputElement>;
  alertList: AlertData[] = [
    {label: 'Stille', name: null},
    {label: 'Waltonhupe', name: '001'},
    {label: 'Chewbacca', name: '002'},
    {label: 'Flipper', name: '003'},
    {label: 'Darth Vader', name: '004'},
    {label: 'Tusch', name: '005'},
    {label: 'Sirene', name: '006'},
    {label: 'Wecker', name: '007'},
    {label: 'Buzzer', name: '008'}
  ];

  constructor(public ss: SessionService,
              public ps: PillService) {
  }

  get nowText(): string {
    return Utils.fmtTime(Utils.getTime());
  }

  get modeIcon(): string {
    const list: { [key: string]: string } = {
      view: 'schedule',
      edit: 'edit',
      timeline: 'timelapse'
    };
    return list[this.ss.data.appMode] ?? 'help';
  }

  get listMedication(): PillTimeData[] {
    const ret: PillTimeData[] = [];
    for (const pill of this.ss.data.listMedication) {
      for (const time of pill.timeList) {
        ret.push(new PillTimeData(pill, time));
      }
    }
    return Utils.sortTime(ret, (m) => m.time);
  }

  get listTimeline(): TimelineData[] {
    const ret: TimelineData[] = [];
    let last: PillTimeData = null;
    for (const data of this.listMedication) {
      if (data.time.isDowActive(new Date())) {
        if (Utils.isToday(data.time.nextConsume) || this.ss.data.showPast) {
          if (last == null || last.time.time !== data.time.time) {
            const time = new TimelineData(data.pill, data.time);
            if (last != null && data.time.time - last.time.time < 120) {
              time.offsetY = 90 * ret[ret.length - 1].data.length + ret[ret.length - 1].offsetY;
            }
            ret.push(time);
          } else {
            ret[ret.length - 1].data.push(data);
          }
          last = data;
        }
      }
    }
    return ret;
  }

  get styleForToolbarMark(): any {
    const x = 10 + Utils.getTime() / 60 / 24 * 80;
    return {'left': `${x}%`};
  }

  get styleForToolbarText(): any {
    const x = 10 + Utils.getTime() / 60 / 24 * 80;
    return {'left': `calc(${x}% - 5em)`};
  }

  styleForTimemark(time: number): any {
    const x = time / 24 * 100;
    return {'left': `${x}%`};
  }

  styleForTimepart(data: TimelineData): any {
    const x = data.time / 60 / 24 * 100;
    const ret: any = {'left': `${x}%`};
    if (data.offsetY > 0) {
      ret['padding-top'] = `${data.offsetY}px`;
    }
    return ret;
  }

  styleForTimetext(time: number): any {
    const x = time / 24 * 100;
    return {'left': `calc(${x}% - 1em)`};
  };

  ngOnInit(): void {
    this.initMode();
  }

  onViewTimer(): void {
    const pill = this.ss.data.listMedication.find(p => p.isAlerted);
    if (pill != null) {
      this.ps.playAudio(this.ss.data.alertName);
    }
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
    HelpData.id = `hlp-mode-${this.ss.data.appMode}`;
    if (['timeline'].indexOf(this.ss.data.appMode) >= 0) {
      this.onViewTimer();
    } else {
      this.stopTimer();
    }
  }

  clickMode(event: MouseEvent) {
    event.stopPropagation();
    this.ss.data.appMode = Utils.nextListItem(this.ss.data.appMode, PillmanData.modeList);
    HelpData.id = `hlp-mode-${this.ss.data.appMode}`;
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

  clickExport() {
    saveAs(new Blob([this.ss.data.asString]), `pillman.${Utils.fmtDate(new Date(), 'yyyyMMddhhmm')}.json`);
  }

  clickImport() {
    this.fileSelect.nativeElement.click();
  }

  fileSelected(fileInput: any) {
    if (fileInput?.target?.files?.length > 0) {
      const reader = new FileReader();
      const file = fileInput.target.files[0];
      reader.addEventListener('load', (event: any) => {
        let content = event.target.result;
        const pos = content.indexOf(',');
        if (pos >= 0) {
          content = content.substring(pos + 1);
        }
        content = atob(content);
        this.ss.data = PillmanData.fromString(content);
      });
      reader.readAsDataURL(file);
    } else {
      console.error(fileInput);
      Log.error(fileInput);
    }
  }

  clickShowPast() {
    this.ss.data.showPast = !this.ss.data.showPast;
    this.ss.save();
  }

  clickAlertSelect(event: MouseEvent, alert: AlertData) {
    this.ss.data.alertName = alert.name;
    this.ps.stopAudio();
    this.ss.save();
  }

  clickAlertPlay(event: MouseEvent, alert: AlertData) {
    event.stopPropagation();
    if (this.ps.isPlayingAudio) {
      this.ps.stopAudio();
    } else {
      this.ps.playAudio(alert.name);
    }
  }

  classForAlertItem(alert: AlertData): string[] {
    const ret = [];
    if (this.ss.data.alertName === alert.name) {
      ret.push('mark');
    }
    return ret;
  }

  alertMenuOpened() {
    HelpData.set('hlp-alert-menu');
  }

  alertMenuClosed() {
    HelpData.clear('hlp-alert-menu');
  }
}
