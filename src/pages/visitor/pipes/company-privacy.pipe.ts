import { Pipe, PipeTransform } from '@angular/core'

import {
  VisitorMatcherStatus,
} from '../models/matcher.model'

@Pipe({
  name: 'customerCompanyPrivacy'
})
export class CustomerCompanyPrivacyPipe implements PipeTransform {
  transform(company: string, status: VisitorMatcherStatus): string {
    return status === VisitorMatcherStatus.AGREE ? company : '*'.repeat(6)
  }
}
