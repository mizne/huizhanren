import { Customer } from './customer.model'

export interface Group {
  id?: string
  name: string
  num?: number
  active?: boolean
  selected?: boolean
  createdAt?: string

  scrollTop?: number
}


export interface NestGroup extends Group {
  customers: Customer[]
}
