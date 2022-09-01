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

  onColorFileLoaded(content: string): void {
    if (content.length < 500000) {
      this.ss.data.colorImage = content;
      this.ss.save();
    }
  }

  ngOnInit(): void {
  }

  showPill(pill: PillData): boolean {
    let ret = true;
    return ret;
  }

  clickMode(event: MouseEvent) {
    event.stopPropagation();
    const list = {view: 'edit', edit: 'view'};
    this.ss.data.appMode = list[this.ss.data.appMode] as any;
  }
}
