import { Pipe, PipeTransform } from '@angular/core';
import { Customer } from '../pages/customer/models/customer.model'

@Pipe({
  name: 'group'
})
export class GroupPipe implements PipeTransform {
  transform(customers: Customer[], searchText: string): any {
    return customers.filter(customer => {
      const findCompany = customer.companys.find(company => company.value.indexOf(searchText) >= 0)
      const findCustomerName = customer.name.indexOf(searchText) >= 0
      const findPhone = customer.phones.find(phone => phone.value.indexOf(searchText) >= 0)

      return findCompany || findCustomerName || findPhone
    })
  }
}