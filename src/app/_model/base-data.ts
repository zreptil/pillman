import {Utils} from '../classes/utils';
import {Log} from '@/_services/log.service';

export abstract class BaseData {
  abstract get asJson(): any;

  get asString(): string {
    try {
      return JSON.stringify(this.asJson);
    } catch (ex) {
      Utils.showDebug(ex);
      Log.error(`Fehler bei BaseData.asJsonString`);
    }
    return null;
  }

  abstract _fillFromJson(json: any): void;

  fillFromJson(json: any): void {
    try {
      this._fillFromJson(json);
    } catch (ex) {
      Utils.showDebug(ex);
      console.error('Fehler bei fillFromJson von', this, json);
    }
  };

  fillFromString(src: string): void {
    try {
      this.fillFromJson(JSON.parse(src));
    } catch (ex) {
      Utils.showDebug(ex);
      console.error('Fehler beim Parsing von', this, src);
    }
  }
}
