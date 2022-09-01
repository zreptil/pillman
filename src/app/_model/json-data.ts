import {Log} from '../_services/log.service';

export class JsonData {
  static toNumber(json: any): number {
    return +json;
  }

  static toString(json: any): string {
    return `${json}`;
  }

  static toDate(json: any, def: Date = null): Date {
    let ret = def;
    try {
      ret = new Date(json);
    } catch (ex) {
      ret = def;
      Log.error(`Fehler bei Umwandlung in ein Datum: ${json}`);
    }
    return ret;
  }
}
