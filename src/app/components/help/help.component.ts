import {Component, Input, OnInit} from '@angular/core';
import {SessionService} from '@/_services/session.service';
import {PillService} from '@/_services/pill.service';

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

  ngOnInit(): void {
  }
}
