import {Injectable} from '@angular/core';
import {PillmanData} from '../_model/pillman-data';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public data: PillmanData;

  constructor(public ss: StorageService) {
    // const data = PillmanData.fromJson({
    //   'cd': 0,
    //   'med': [{
    //     'n': 'Atorvastatin',
    //     't': 7 * 60,
    //     'lc': new Date().valueOf(),
    //     'i': 0,
    //     'c': 1,
    //     's': 100,
    //     'low': 10
    //   }]
    // });
    // for (let i = 0; i < 10; i++) {
    //   data.listMedication.push(data.listMedication[0]);
    // }
    // this.pillmanData = data;
    // this.save();
    this.load();
  }

  load(): void {
    this.data = new PillmanData();
    this.data.fillFromString(this.ss.read('data'));
  }

  save(): void {
    this.ss.write('data', this.data);
  }
}
