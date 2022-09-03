import {BaseData} from './base-data';
import {PillData} from './pill-data';
import {JsonData} from './json-data';
import {UserData} from '@/_model/user-data';

export enum ConsumeDisplay {
  Time,
  TimeSpan
}

export class PillmanData extends BaseData {
  user: UserData;
  consumeDisplay: ConsumeDisplay;
  listMedication: PillData[] = [];
  appMode: 'view' | 'edit' = 'view';
  showHelp = true;
  colorImage: string;

  constructor() {
    super();
  }

  get asJson(): any {
    const medis: PillData[] = [];
    for (const pill of this.listMedication) {
      medis.push(pill.asJson);
    }
    return {
      'u': this.user,
      'm': this.appMode,
      'cd': this.consumeDisplay?.valueOf() || 0,
      'med': medis,
      'ci': this.colorImage,
      'sh': this.showHelp
    };
  }

  static fromJson(json: any): PillmanData {
    const ret = new PillmanData();
    ret.fillFromJson(json);
    return ret;
  }

  _fillFromJson(json: any): void {
    this.user = UserData.fromJson(json);
    this.appMode = JsonData.toString(json, 'm', 'view') as any;
    this.consumeDisplay = JsonData.toNumber(json, 'cd');
    this.listMedication = [];
    for (const med of json['med'] || []) {
      this.listMedication.push(PillData.fromJson(med));
    }
    this.colorImage = JsonData.toString(json, 'ci');
    this.showHelp = JsonData.toBool(json, 'sh', true);
  }
}
