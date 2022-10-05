import {BaseData} from '@/_model/base-data';
import {JsonData} from '@/_model/json-data';
import {Utils} from '@/classes/utils';

export class TimeData extends BaseData {
  count: number = 1;
  time: number = 8 * 60;
  dowActive = [true, true, true, true, true, true, true];
  lastConsumed: Date;
  nextConsume: Date;
  start: Date;
  end: Date;

  get asJson(): any {
    this.setNextConsume();
    return {
      'c': this.count,
      't': this.time,
      'da': this.dowActive,
      'lc': this.lastConsumed,
      's': this.start?.getTime(),
      'e': this.end?.getTime()
    };
  }

  get isAlerted(): boolean {
    return this.time <= Utils.getTime() && Utils.isToday(this.nextConsume);
  }

  static fromJson(json: any): TimeData {
    const ret = new TimeData();
    ret.fillFromJson(json);
    return ret;
  }

  _fillFromJson(json: any): void {
    this.time = JsonData.toNumber(json, 't', 8 * 60);
    this.count = JsonData.toNumber(json, 'c');
    this.dowActive = json['da'] ?? [true, true, true, true, true, true, true];
    this.lastConsumed = JsonData.toDate(json, 'lc', null);
    this.start = JsonData.toDate(json, 's', null);
    this.end = JsonData.toDate(json, 'e', null);
    this.setNextConsume();
  }

  isDowActive(date: Date) {
    let dow = date.getDay() - 1;
    if (dow < 0) {
      dow = 6;
    }
    return this.dowActive[dow];
  }

  setNextConsume(): void {
    const time = this.time;
    if (Utils.isToday(this.lastConsumed)) {
      this.nextConsume = new Date();
      this.nextConsume.setHours(Math.floor(time / 60));
      this.nextConsume.setMinutes(time % 60);
      this.nextConsume.setDate(this.nextConsume.getDate() + 1);
    } else if (Utils.isTodayOrBefore(this.lastConsumed)) {
      this.nextConsume = new Date();
      this.nextConsume.setHours(Math.floor(time / 60));
      this.nextConsume.setMinutes(time % 60);
    } else {
      let next: Date = this.lastConsumed;
      if (next == null) {
        next = new Date();
        next.setDate(next.getDate() - 1);
      }
      const check = next.getHours() * 60 + next.getMinutes();
      if (time < check) {
        next.setTime(next.getTime() + 1);
      }
      next.setHours(Math.floor(time / 60));
      next.setMinutes(time % 60);
      this.nextConsume = next;
    }
    // Log.debug({name: this.name, last: Utils.fmtDate(this.lastConsumed), next: Utils.fmtDate(this.nextConsume)});
  }
}

