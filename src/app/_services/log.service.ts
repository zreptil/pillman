import {Injectable} from '@angular/core';

export class Log {
  static get msg(): { [key: string]: string[] } {
    return LogService.instance.msg;
  }

  static clear(type: string): void {
    LogService.instance.msg[type] = [];
  }

  static info(text: any): void {
    LogService.instance.msg['info']?.push(text);
  }

  static debug(text: string): void {
    LogService.instance.msg['debug']?.push(text);
  }

  static error(text: string): void {
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

  constructor() {
  }

  static create(): void {
    LogService.instance = new LogService();
  }
}
