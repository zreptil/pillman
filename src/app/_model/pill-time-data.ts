import {PillData} from '@/_model/pill-data';
import {TimeData} from '@/_model/time-data';

export class PillTimeData {
  constructor(public pill: PillData,
              public time: TimeData
  ) {
  }
}
