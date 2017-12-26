import { Customer } from './customer.model'

export class Group {
  id?: string
  name: string
  num?: number
  active?: boolean
  selected?: boolean
  createdAt?: string
  scrollTop?: number

  static convertFromResp(resp: GroupResp): Group {
    return {
      id: resp.RecordId,
      name: resp.Name,
      active: false,
      selected: false,
      createdAt: resp.CreatedAt,
      scrollTop: 0
    }
  }

  static NONE: Group = {
    id: '无标签',
    name: '无标签',
    active: true,
    selected: false,
    createdAt: '1970-01-01 00:00:00',
    scrollTop: 0
  }
}

export interface GroupResp {
  RecordId: string
  Name: string
  CreatedAt: string
}

export interface NestGroup extends Group {
  customers: Customer[]
}
