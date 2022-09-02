import {BaseData} from './base-data';
import {PillData} from './pill-data';
import {JsonData} from './json-data';

export enum ConsumeDisplay {
  Time,
  TimeSpan
}

export class PillmanData extends BaseData {
  consumeDisplay: ConsumeDisplay;
  listMedication: PillData[] = [];
  appMode: 'view' | 'edit' = 'view';
  colorImage: string;

  constructor() {
    super();
  }

  get asJson(): any {
    const medis: PillData[] = [];
    for (const pill of this.listMedication) {
      medis.push(pill.asJson);
    }
    return {'cd': this.consumeDisplay?.valueOf() || 0, 'med': medis, 'ci': this.colorImage};
  }

  static fromJson(json: any): PillmanData {
    const ret = new PillmanData();
    ret.fillFromJson(json);
    return ret;
  }

  _fillFromJson(json: any): void {
    if (json == null) return;
    this.consumeDisplay = JsonData.toNumber(json['cd']);
    this.listMedication = [];
    for (const med of json['med']) {
      this.listMedication.push(PillData.fromJson(med));
    }
    this.colorImage = JsonData.toString(json['ci']);
  }
}
