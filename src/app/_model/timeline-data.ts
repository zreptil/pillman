import {PillData} from '@/_model/pill-data';
import {PillTimeData} from '@/_model/pill-time-data';
import {TimeData} from '@/_model/time-data';

export class TimelineData {
  time: number;
  data: PillTimeData[];
  offsetY: number = 0;

  constructor(pill: PillData, time: TimeData) {
    this.data = [new PillTimeData(pill, time)];
    this.time = time.time;
  }
}
