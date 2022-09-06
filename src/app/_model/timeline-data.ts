import {PillData} from '@/_model/pill-data';

export class TimelineData {
  time: number;
  pills: PillData[];

  constructor(pill: PillData) {
    this.pills = [pill];
    this.time = pill.time;
  }
}
