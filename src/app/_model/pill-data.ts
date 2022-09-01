import {BaseData} from './base-data';
import {JsonData} from './json-data';

export class PillData extends BaseData {
  static intervals = {
    daily: {title: $localize`täglich`, days: 1},
    weekly: {title: $localize`wöchentlich`, days: 7}
  };
  isEdit: boolean;
  shape: 'round' | 'capsule';
  color = 0xfff;
  name: string;
  time: number;
  lastConsumed: Date;
  nextConsume: Date;
  interval: 'daily' | 'weekly';
  count: number;
  supply: number;
  supplyLow: number;
  dowActive = [true, true, true, true, true, true, true];

  get asJson(): any {
    return {
      'n': this.name,
      't': this.time,
      'lc': this.lastConsumed,
      'i': this.interval,
      'c': this.count,
      's': this.supply,
      'low': this.supplyLow,
      'sh': this.shape,
      'col': this.color
    };
  }

  static fromString(src: string) {
    const ret = new PillData();
    ret.fillFromString(src);
    return ret;
  }

  static fromJson(json: any): PillData {
    const ret = new PillData();
    ret.fillFromJson(json);
    return ret;
  }

  _fillFromJson(json: any): void {
    this.name = JsonData.toString(json['n']);
    this.time = JsonData.toNumber(json['t'] || 8 * 60);
    this.lastConsumed = JsonData.toDate(json['lc'], null);
    this.interval = json['i'] || 'daily';
    this.count = JsonData.toNumber(json['c']);
    this.supply = JsonData.toNumber(json['s']);
    this.supplyLow = JsonData.toNumber(json['low']);
    this.shape = json['sh'] || 'round';
    this.color = JsonData.toNumber(json['col']) || 0xfff;
  }

  setNextConsume(): void {
    let next: Date = this.lastConsumed || new Date();
    const hour = Math.floor((this.time || 8 * 60) / 60);
    const minute = (this.time || 8 * 60) % 60;
    const check = next.getHours() * 60 + next.getMinutes();
    if (this.time < check) {
      next.setTime(next.getTime() + PillData.intervals[this.interval].days);
    }
    this.nextConsume = next;
  }
}
