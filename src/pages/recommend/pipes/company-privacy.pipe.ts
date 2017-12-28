import { Pipe, PipeTransform } from '@angular/core'

import {
  MatcherStatus,
} from '../models/matcher.model'

@Pipe({
  name: 'customerCompanyPrivacy'
})
export class CustomerCompanyPrivacyPipe implements PipeTransform {
  transform(company: string, status: MatcherStatus): string {
    return status === MatcherStatus.AGREE ? company : 'X'.repeat(6)
  }
}
