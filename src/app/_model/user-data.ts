import {BaseData} from "./base-data";

export class UserData extends BaseData {
  constructor(public name: string = null) {
    super();
  }

  asJson(): any {
    return {
      'n': this.name
    };
  }

  fromJson(json: any): void {
    this.name = BaseData.fromJsonText(json['n']);
  }

}
