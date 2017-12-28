import { Pipe, PipeTransform } from '@angular/core';
import { Exhibition } from '../models/exhibition.model'

import * as moment from 'moment'

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(exhibition: Exhibition): any {
    return DurationPipe.convertDate(exhibition.startTime) + ' - ' + DurationPipe.convertDate(exhibition.endTime)
  }

  static convertDate(timeStr: string) {
    return moment(timeStr, "YYYY/MM/DD H:mm:ss").format('YYYY年MM月DD日')
  }
}
