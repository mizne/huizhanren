import { Pipe, PipeTransform } from '@angular/core'

import {
  VisitorMatcherStatus,
} from '../models/matcher.model'

@Pipe({
  name: 'customerNamePrivacy'
})
export class CustomerNamePrivacyPipe implements PipeTransform {
  transform(name: string, status: VisitorMatcherStatus): string {
    if (!name) {
      return ''
    }
    return status === VisitorMatcherStatus.AGREE ? name : name.slice(0, 1) + 'X'.repeat(name.length - 1)
  }
}
