import {Injectable} from '@angular/core';

export class Log {
  static get mayDebug(): boolean {
    return LogService.instance.mayDebug;
  }

  static get msg(): { [key: string]: any[] } {
    return LogService.instance.msg;
  }

  static clear(type: string): void {
    LogService.instance.msg[type] = [];
  }

  static info(text: any): void {
    LogService.instance.msg['info']?.push(text);
  }

  static debug(text: any): void {
    LogService.instance.msg['debug']?.push(text);
  }

  static error(text: any): void {
    LogService.instance.msg['error']?.push(text);
  }
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  public static instance: LogService;

  msg: { [key: string]: string[] } = {
    info: [],
    debug: [],
    error: []
  };

  constructor(public mayDebug: boolean) {
  }

  static create(mayDebug: boolean): void {
    LogService.instance = new LogService(mayDebug);
  }
}
