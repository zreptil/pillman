import {BaseData} from './base-data';
import {JsonData} from './json-data';
import {ColorData} from '@/_model/color-data';

export class PillData extends BaseData {
  static intervals = {
    daily: {title: $localize`täglich`, days: 1},
    weekly: {title: $localize`wöchentlich`, days: 7}
  };

  static shapeList = ['roundS', 'roundM', 'roundL', 'capsule'];

  isEdit: boolean = false;
  shape: 'roundL' | 'roundM' | 'roundS' | 'capsule' = PillData.shapeList[0] as any;
  color: ColorData = new ColorData([255, 255, 255]);
  name: string;
  time: number = 8 * 60;
  lastConsumed: Date;
  nextConsume: Date;
  interval: 'daily' | 'weekly' = 'daily';
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
      'col': this.color.value
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
    console.log(json);
    this.name = JsonData.toString(json['n']);
    this.time = JsonData.toNumber(json['t'] || 8 * 60);
    this.lastConsumed = JsonData.toDate(json['lc'], null);
    this.interval = json['i'] || 'daily';
    this.count = JsonData.toNumber(json['c']);
    this.supply = JsonData.toNumber(json['s']);
    this.supplyLow = JsonData.toNumber(json['low']);
    this.shape = json['sh'];
    if (PillData.shapeList.find(s => s === this.shape) == null) {
      this.shape = PillData.shapeList[0] as any;
    }
    this.color = new ColorData(json['col'] || [255, 255, 255]);
    console.log(this);
  }

  setNextConsume(): void {
    let next: Date = this.lastConsumed || new Date();
    const check = next.getHours() * 60 + next.getMinutes();
    if (this.time < check) {
      next.setTime(next.getTime() + PillData.intervals[this.interval].days);
    }
    this.nextConsume = next;
  }
}
