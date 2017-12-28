import { Pipe, PipeTransform } from '@angular/core'

import {
  MatcherStatus,
  convertMatcherDescFromModel
} from '../models/matcher.model'

@Pipe({
  name: 'customerMatcherStatus'
})
export class CustomerMatcherStatusPipe implements PipeTransform {
  transform(value: MatcherStatus, isSender: boolean): string {
    return convertMatcherDescFromModel(value, isSender)
  }
}
