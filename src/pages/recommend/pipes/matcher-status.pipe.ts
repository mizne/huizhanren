import { Pipe, PipeTransform } from '@angular/core'

import {
  MatcherStatus,
  convertMatcherStatusFromModel
} from '../models/matcher.model'

@Pipe({
  name: 'customerMatcherStatus'
})
export class CustomerMatcherStatusPipe implements PipeTransform {
  transform(value: MatcherStatus): string {
    return convertMatcherStatusFromModel(value)
  }
}
