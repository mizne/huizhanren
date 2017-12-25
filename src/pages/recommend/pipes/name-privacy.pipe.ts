import { Pipe, PipeTransform } from '@angular/core'

import {
  MatcherStatus,
} from '../models/matcher.model'

@Pipe({
  name: 'customerNamePrivacy'
})
export class CustomerNamePrivacyPipe implements PipeTransform {
  transform(name: string, status: MatcherStatus): string {
    return status === MatcherStatus.AGREE ? name : name.slice(0, 1) + 'X'.repeat(name.length - 1)
  }
}
