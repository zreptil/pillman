import {ChangeDetectorRef, Component, HostListener} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {LogService} from '@/_services/log.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pillman';

  constructor(public ss: SessionService,
              cr: ChangeDetectorRef) {
    LogService.cr = cr;
  }

  @HostListener('document:keydown.f1', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    event.preventDefault();
    this.ss.data.showHelp = !this.ss.data.showHelp;
    this.ss.save();
  }
}
