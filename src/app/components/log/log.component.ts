import {Component, OnInit} from '@angular/core';
import {Log} from '@/_services/log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  constructor() {
  }

  get msg(): { [key: string]: any[] } {
    return Log.msg;
  };

  typeOf(line: any): string {
    if (typeof line === 'string') {
      return 'string';
    }
    return '';
  }

  onClickDelete(event: Event, type: string): void {
    event.preventDefault();
    Log.clear(type);
  }

  ngOnInit(): void {
  }

  showType(type: string) {
    let ret = this.msg[type].length > 0;
    if (ret && type === 'debug' && !Log.mayDebug) {
      return false;
    }
    return ret;
  }
}
