import { Pipe, PipeTransform } from '@angular/core'

import {
  ExhibitorMatcherStatus,
  convertMatcherDescFromModel
} from '../models/matcher.model'

@Pipe({
  name: 'exhibitorMatcherStatus'
})
export class ExhibitorMatcherStatusPipe implements PipeTransform {
  transform(value: ExhibitorMatcherStatus, isSender: boolean): string {
    return convertMatcherDescFromModel(value, isSender)
  }
}
