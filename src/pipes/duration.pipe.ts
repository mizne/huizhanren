import { Pipe, PipeTransform } from '@angular/core';
import { Exhibition } from '../pages/login/models/exhibition.model'

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(exhibition: Exhibition, group: string): any {

    return DurationPipe.convertDate(exhibition.startTime) + ' - ' + DurationPipe.convertDate(exhibition.endTime)
  }

  static convertDate(src) {
    return src.split('-').map((e, i) => {
      if (i === 0) {
        return e + '年'
      }
      if (i === 1) {
        return e + '月'
      }
      if (i === 2) {
        return e + '日'
      }
    }).join('')
  }
}