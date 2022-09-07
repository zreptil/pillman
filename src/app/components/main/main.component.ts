import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {PillData} from '@/_model/pill-data';
import {PillService} from '@/_services/pill.service';
import {Utils} from '@/classes/utils';
import {TimelineData} from '@/_model/timeline-data';
import {PillmanData} from '@/_model/pillman-data';
import {saveAs} from 'file-saver';
import {Log} from '@/_services/log.service';

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
    {label: 'Waltonhupe', name: '001'},
    {label: 'Chewbacca', name: '002'},
    {label: 'Flipper', name: '003'},
    {label: 'Darth Vader', name: '004'},
    {label: 'Tusch', name: '005'},
    {label: 'Sirene', name: '006'}
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
      if (pill.isDowActive(new Date())) {
        if (Utils.isToday(pill.nextConsume) || this.ss.data.showPast) {
          if (last == null || last.time !== pill.time) {
            ret.push(new TimelineData(pill));
          } else {
            ret[ret.length - 1].pills.push(pill);
          }
          last = pill;
        }
      }
    }
    return ret;
  }

  get styleForCurrentmark(): any {
    return this.styleForTimemark(Utils.getTime() / 60);
  }

  get styleForCurrenttext(): any {
    const x = Utils.getTime() / 60 / 24 * 90;
    return {'left': `calc(${x}% - 5em)`};
  }

  styleForTimemark(time: number): any {
    const x = time / 24 * 90;
    return {'left': `${x}%`};
  }

  styleForTimepart(time: number): any {
    const x = time / 24 * 90;
    return {'left': `${x}%`};
  }

  styleForTimetext(time: number): any {
    const x = time / 24 * 90;
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
    if (['timeline'].indexOf(this.ss.data.appMode) >= 0) {
      this.onViewTimer();
    } else {
      this.stopTimer();
    }
  }

  clickMode(event: MouseEvent) {
    event.stopPropagation();
    this.ss.data.appMode = Utils.nextListItem(this.ss.data.appMode, PillmanData.modeList);
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
}
