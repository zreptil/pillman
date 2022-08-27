import {Utils} from "../classes/utils";

export abstract class BaseData {
  static fromJsonText(json: any): string {
    return `${json}`;
  }

  abstract fromJson(json: any): void;

  abstract asJson(): any;

  asJsonString(): string {
    try {
      return JSON.stringify(this.asJson());
    } catch (ex) {
      Utils.showDebug(ex);
      Utils.show(`Fehler bei asJsonString`);
    }
    return null;
  }

  fromJsonString(json: string) {
    try {
      this.fromJson(JSON.parse(json));
    } catch (ex) {
      Utils.showDebug(ex);
      Utils.show(`Fehler beim Parsing von ${json}`);
    }
  }
}
