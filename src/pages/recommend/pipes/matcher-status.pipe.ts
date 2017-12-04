import { Pipe, PipeTransform } from '@angular/core'

import {
  MatcherStatus,
  convertMatcherStatusFromModel
} from '../models/matcher.model'

@Pipe({
  name: 'matcherStatus'
})
export class MatcherStatusPipe implements PipeTransform {
  transform(value: MatcherStatus): string {
    return convertMatcherStatusFromModel(value)
  }
}
