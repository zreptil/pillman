import {BaseData} from './base-data';
import {JsonData} from './json-data';
import {ColorData} from '@/_model/color-data';
import {Utils} from '@/classes/utils';

export class TimeData extends BaseData {
  count: number = 1;
  time: number = 8 * 60;
  dowActive = [true, true, true, true, true, true, true];

  get asJson(): any {
    return {
      'c': this.count,
      't': this.time,
      'da': this.dowActive
    };
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
  }
}

export class PillData extends BaseData {
  static intervals: { [key: string]: any } = {
    daily: {title: $localize`täglich`, days: 1},
    weekly: {title: $localize`wöchentlich`, days: 7}
  };

  static shapeList = ['roundS', 'roundM', 'roundL', 'capsule'];
  static alertList = ['none', 'wiggle', 'wobble', 'sizer'];
  static alertTextList = ['none', 'pulse'];

  shape: string = PillData.shapeList[0];
  splith: boolean = false;
  splitv: boolean = false;
  color: ColorData = new ColorData([255, 255, 255]);
  name: string;
  interval: string = 'daily';
  supply: number = 0;
  supplyLow: number = 0;
  alertAnimation: string = PillData.alertList[1];
  alertAnimationText: string = PillData.alertTextList[1];

  lastConsumed: Date;
  nextConsume: Date;

  timeList: TimeData[];

  count: number = 1;
  time: number = 8 * 60;
  dowActive = [true, true, true, true, true, true, true];

  get asJson(): any {
    this.setNextConsume();
    return {
      'n': this.name,
      'lc': this.lastConsumed,
      'i': this.interval,
      's': this.supply,
      'low': this.supplyLow,
      'sh': this.shape,
      'col': this.color.value,
      'sph': this.splith,
      'spv': this.splitv,
      'aa': this.alertAnimation,
      'at': this.alertAnimationText,
      'c': this.count,
      't': this.time,
      'da': this.dowActive,
      'tl': this.timeList?.map(m => m.asJson)
    };
  }

  get isSupplyLow(): boolean {
    return this.supplyLow > 0 && this.supply <= this.supplyLow;
  }

  get isAlerted(): boolean {
    return this.time <= Utils.getTime() && Utils.isToday(this.nextConsume);
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
    this.name = JsonData.toString(json, 'n');
    this.lastConsumed = JsonData.toDate(json, 'lc', null);
    this.interval = json['i'] || 'daily';
    this.supply = JsonData.toNumber(json, 's');
    this.supplyLow = JsonData.toNumber(json, 'low');
    this.shape = json['sh'];
    if (PillData.shapeList.find(s => s === this.shape) == null) {
      this.shape = PillData.shapeList[0];
    }
    this.color = new ColorData(json['col'] || [255, 255, 255]);
    this.splith = JsonData.toBool(json, 'sph');
    this.splitv = JsonData.toBool(json, 'spv');
    this.alertAnimation = json['aa'];
    if (PillData.alertList.find(a => a === this.alertAnimation) == null) {
      this.alertAnimation = PillData.alertList[1];
    }
    this.alertAnimationText = json['at'];
    if (PillData.alertTextList.find(a => a === this.alertAnimationText) == null) {
      this.alertAnimationText = PillData.alertTextList[1];
    }
    this.time = JsonData.toNumber(json, 't', 8 * 60);
    this.count = JsonData.toNumber(json, 'c');
    this.dowActive = json['da'] ?? [true, true, true, true, true, true, true];
    this.timeList = (json['tl'] ?? []).map((m: any) => TimeData.fromJson(m));
    this.setNextConsume();
  }

  setNextConsume(): void {
    if (Utils.isToday(this.lastConsumed)) {
      this.nextConsume = new Date();
      this.nextConsume.setHours(Math.floor(this.time / 60));
      this.nextConsume.setMinutes(this.time % 60);
      this.nextConsume.setDate(this.nextConsume.getDate() + 1);
    } else if (Utils.isTodayOrBefore(this.lastConsumed)) {
      this.nextConsume = new Date();
      this.nextConsume.setHours(Math.floor(this.time / 60));
      this.nextConsume.setMinutes(this.time % 60);
    } else {
      let next: Date = this.lastConsumed;
      if (next == null) {
        next = new Date();
        next.setDate(next.getDate() - 1);
      }
      const check = next.getHours() * 60 + next.getMinutes();
      if (this.time < check) {
        next.setTime(next.getTime() + (PillData.intervals[this.interval]?.days || 1));
      }
      next.setHours(Math.floor(this.time / 60));
      next.setMinutes(this.time % 60);
      this.nextConsume = next;
    }
    // Log.debug({name: this.name, last: Utils.fmtDate(this.lastConsumed), next: Utils.fmtDate(this.nextConsume)});
  }

  isDowActive(date: Date) {
    let dow = date.getDay() - 1;
    if (dow < 0) {
      dow = 6;
    }
    return this.dowActive[dow];
  }
}
