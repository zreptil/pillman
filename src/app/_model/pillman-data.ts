import {BaseData} from './base-data';
import {PillData} from './pill-data';
import {JsonData} from './json-data';
import {UserData} from '@/_model/user-data';
import {Log} from '@/_services/log.service';

export enum ConsumeDisplay {
  Time,
  TimeSpan
}

export class PillmanData extends BaseData {
  static timeList = ['time', 'duration'];
  static modeList = ['edit', 'timeline'];

  user: UserData;
  consumeDisplay: ConsumeDisplay;
  listMedication: PillData[] = [];
  appMode = PillmanData.modeList[0];
  showPast = true;
  timeDisplay = PillmanData.timeList[0];
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
      'sp': this.showPast,
      'cd': this.consumeDisplay?.valueOf() || 0,
      'med': medis,
      'ci': this.colorImage,
      'sh': this.showHelp,
      'td': this.timeDisplay
    };
  }

  static fromJson(json: any): PillmanData {
    const ret = new PillmanData();
    ret.fillFromJson(json);
    return ret;
  }

  static fromString(src: string) {
    const ret = new PillmanData();
    ret.fillFromString(src);
    return ret;
  }

  _fillFromJson(json: any): void {
    try {
      this.user = UserData.fromJson(json);
      this.appMode = JsonData.toString(json, 'm', PillmanData.modeList[0]);
      this.showPast = JsonData.toBool(json, 'sp', true);
      if (PillmanData.modeList.find(v => v === this.appMode) == null) {
        this.appMode = PillmanData.modeList[0];
      }
      this.consumeDisplay = JsonData.toNumber(json, 'cd');
      this.listMedication = [];
      for (const med of json['med'] || []) {
        this.listMedication.push(PillData.fromJson(med));
      }
      this.colorImage = JsonData.toString(json, 'ci');
      this.showHelp = JsonData.toBool(json, 'sh', true);
      this.timeDisplay = json?.['td'];
      if (PillmanData.timeList.find(v => v === this.timeDisplay) == null) {
        this.timeDisplay = PillmanData.timeList[0];
      }
    } catch (ex) {
      console.error('Fehler beim Laden', json, ex);
      Log.error($localize`Fehler beim Import der Daten`);
    }
  }
}
