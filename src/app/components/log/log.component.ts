import {Component, OnInit} from '@angular/core';
import {Log} from '../../_services/log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  constructor() {
  }

  get msg(): { [key: string]: string[] } {
    return Log.msg;
  };

  onClickDelete(event: Event, type: string): void {
    event.preventDefault();
    Log.clear(type);
  }

  ngOnInit(): void {
  }
}
