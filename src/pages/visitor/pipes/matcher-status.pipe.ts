import { Pipe, PipeTransform } from '@angular/core'

import {
  VisitorMatcherStatus,
  convertMatcherDescFromModel
} from '../models/matcher.model'

@Pipe({
  name: 'customerMatcherStatus'
})
export class CustomerMatcherStatusPipe implements PipeTransform {
  transform(value: VisitorMatcherStatus, isSender: boolean): string {
    return convertMatcherDescFromModel(value, isSender)
  }
}
