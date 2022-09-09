import {Component, Input, OnInit} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {PillService} from '@/_services/pill.service';
import {HelpData} from '@/_model/help-data';
import {Log} from '@/_services/log.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  @Input()
  show = false;

  constructor(public ss: SessionService,
              public ps: PillService) {
  }

  get id(): string {
    return HelpData.id;
  }

  get subId(): string {
    return HelpData.subId;
  }

  defMode(): null {
    Log.debug(`Es gibt keine Hilfe mit der Id ${HelpData.id}`);
    HelpData.id = 'hlp-mode-edit';
    return null;
  }

  ngOnInit(): void {
  }
}
