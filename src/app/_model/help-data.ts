export class HelpData {
  static id: string;
  static subId: string;

  static pastIds: { [key: string]: string } = {};

  static set(id: string) {
    HelpData.pastIds[id] = HelpData.id;
    HelpData.id = id;
  }

  static clear(id: string) {
    HelpData.id = HelpData.pastIds[id] ?? HelpData.id;
  }
}
