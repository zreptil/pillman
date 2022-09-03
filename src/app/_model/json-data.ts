import {Log} from '@/_services/log.service';

export class JsonData {
  static toNumber(json: any, key: string, def = 0): number {
    if (json == null || json[key] == null) {
      return def;
    }
    return +json[key];
  }

  static toString(json: any, key: string, def = ''): string {
    if (json == null || json[key] == null) {
      return def;
    }
    return `${json[key]}`;
  }

  static toBool(json: any, key: string, def = false): boolean {
    if (json == null || json[key] == null) {
      return def;
    }
    return json[key];
  }

  static toDate(json: any, key: string, def: Date = null): Date {
    if (json == null || json[key] == null) {
      return def;
    }
    let ret = def;
    try {
      ret = new Date(json[key]);
    } catch (ex) {
      Log.error(`Fehler bei Umwandlung in ein Datum: ${json}`);
    }
    return ret;
  }
}
