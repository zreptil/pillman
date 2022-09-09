import {BaseData} from './base-data';
import {PillData} from './pill-data';
import {JsonData} from './json-data';
import {UserData} from '@/_model/user-data';
import {Log} from '@/_services/log.service';
import {ColorData} from '@/_model/color-data';
import {ColorMix} from '@/_model/color-mix-data';

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
  colorPickerMode: string;
  savedColors: ColorData[];
  alertName: string = '006';
  mixColors: ColorMix = new ColorMix();

  constructor() {
    super();
  }

  get asJson(): any {
    return {
      'u': this.user,
      'm': this.appMode,
      'sp': this.showPast,
      'cd': this.consumeDisplay?.valueOf() ?? 0,
      'med': this.listMedication?.map(m => m.asJson) ?? [],
      'ci': this.colorImage,
      'sc': this.savedColors?.map(m => m.asJson) ?? [],
      'sh': this.showHelp,
      'td': this.timeDisplay,
      'an': this.alertName ?? '006',
      'cm': this.colorPickerMode ?? 'image',
      'colmix': this.mixColors.asJson
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
      for (const med of json['med'] ?? []) {
        this.listMedication.push(PillData.fromJson(med));
      }
      this.colorImage = JsonData.toString(json, 'ci');
      this.savedColors = [];
      for (const color of json['sc'] ?? []) {
        this.savedColors.push(ColorData.fromJson(color));
      }
      this.showHelp = JsonData.toBool(json, 'sh', true);
      this.timeDisplay = json?.['td'];
      if (PillmanData.timeList.find(v => v === this.timeDisplay) == null) {
        this.timeDisplay = PillmanData.timeList[0];
      }
      this.alertName = JsonData.toString(json, 'an');
      this.colorPickerMode = JsonData.toString(json, 'cm') ?? 'image';
      this.mixColors = ColorMix.fromJson(json);
    } catch (ex) {
      console.error('Fehler beim Laden', json, ex);
      Log.error($localize`Fehler beim Import der Daten`);
    }
  }
}
