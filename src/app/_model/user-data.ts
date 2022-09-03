import {BaseData} from './base-data';
import {JsonData} from '@/_model/json-data';

export class UserData extends BaseData {
  constructor(public name: string = null) {
    super();
  }

  get asJson(): any {
    return {
      'n': this.name
    };
  }

  static fromJson(json: any): UserData {
    const ret = new UserData();
    ret.fillFromJson(json);
    return ret;
  }

  _fillFromJson(json: any): void {
    this.name = JsonData.toString(json, 'n', 'Max Mustermann');
  }

}
