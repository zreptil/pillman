import {PillData} from '@/_model/pill-data';

export class TimelineData {
  time: number;
  timeDiff: number;
  pills: PillData[];

  constructor(pill: PillData, lastTime: number) {
    this.pills = [pill];
    this.time = pill.time;
    this.timeDiff = this.time - lastTime;
  }
}
