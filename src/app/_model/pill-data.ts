import {BaseData} from './base-data';
import {JsonData} from './json-data';
import {ColorData} from '@/_model/color-data';
import {Utils} from '@/classes/utils';
import {TimeData} from '@/_model/time-data';

export class PillData extends BaseData {
  static shapeList = ['roundS', 'roundM', 'roundL', 'capsule', 'oval', 'creme'];
  static alertList = ['none', 'wiggle', 'wobble', 'sizer'];
  static alertTextList = ['none', 'pulse'];

  shape: string = PillData.shapeList[0];
  splith: boolean = false;
  splitv: boolean = false;
  color: ColorData = new ColorData([255, 255, 255]);
  name: string;
  description: string;
  interval: string = 'daily';
  supply: number = 0;
  supplyLow: number = 0;
  alertAnimation: string = PillData.alertList[1];
  alertAnimationText: string = PillData.alertTextList[1];

  timeList: TimeData[] = [new TimeData()];

  get asJson(): any {
    return {
      'n': this.name,
      'd': this.description,
      'i': this.interval,
      's': this.supply,
      'low': this.supplyLow,
      'sh': this.shape,
      'col': this.color.value,
      'sph': this.splith,
      'spv': this.splitv,
      'aa': this.alertAnimation,
      'at': this.alertAnimationText,
      'tl': this.timeList?.map(m => m.asJson)
    };
  }

  get isSupplyLow(): boolean {
    return this.supplyLow > 0 && this.supply <= this.supplyLow;
  }

  get isAlerted(): boolean {
    return this.timeList.find(t => t.isAlerted) != null;
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
    this.description = JsonData.toString(json, 'd');
    this.interval = json['i'] ?? 'daily';
    this.supply = JsonData.toNumber(json, 's');
    this.supplyLow = JsonData.toNumber(json, 'low');
    this.shape = json['sh'];
    if (PillData.shapeList.find(s => s === this.shape) == null) {
      this.shape = PillData.shapeList[0];
    }
    this.color = new ColorData(json['col'] ?? [255, 255, 255]);
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
    this.timeList = Utils.sortTime(json['tl'] ?? []).map((m: any) => TimeData.fromJson(m)) ?? [];
    if (this.timeList.length == 0) {
      this.timeList.push(new TimeData());
    }
  }
}
