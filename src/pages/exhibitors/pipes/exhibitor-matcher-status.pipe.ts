import { Pipe, PipeTransform } from '@angular/core'

import {
  ExhibitorMatcherStatus,
  convertMatcherStatusFromModel
} from '../models/matcher.model'

@Pipe({
  name: 'exhibitorMatcherStatus'
})
export class ExhibitorMatcherStatusPipe implements PipeTransform {
  transform(value: ExhibitorMatcherStatus): string {
    return convertMatcherStatusFromModel(value)
  }
}
