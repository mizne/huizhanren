import { Customer } from './customer.model'

export interface CardResp {
  cardImg: string
  cardInfo: CardInfo
}

export interface CardInfo {
  addr: string[]
  company: string[]
  department: string[]
  email: string[]
  name: string
  tel_cell: string[]
  tel_work: string[]
  title: string[]
}

export interface CustomField {
  title: string
  single?: boolean
  value?: string
  name?: string
  items?: FieldItem[]
}

export interface FieldItem {
  label: string
  value: string
}

type fields = {
  fields1: CustomField[]
  fields2: CustomField[]
}

export function createFields1(): CustomField[] {
  return [
    {
      title: '姓名',
      single: true,
      value: '',
      name: 'name'
    },
    {
      title: '电话',
      items: [
        {
          label: '工作电话',
          value: ''
        }
      ]
    },
    {
      title: '部门',
      items: [
        {
          label: '部门',
          value: ''
        }
      ]
    },
    {
      title: '职位',
      items: [
        {
          label: '职位',
          value: ''
        }
      ]
    }
  ]
}

export function createFields2(): CustomField[] {
  return [
    {
      title: '邮箱',
      items: [
        {
          label: '邮箱',
          value: ''
        }
      ]
    },
    {
      title: '公司',
      items: [
        {
          label: '公司',
          value: ''
        }
      ]
    },
    {
      title: '地址',
      items: [
        {
          label: '公司地址',
          value: ''
        }
      ]
    }
  ]
}

export function createFieldsFromCustomer(customer: Customer): fields {
  const mapper = e => ({
    label: e.label,
    value: e.value
  })
  return {
    fields1: [
      {
        title: '姓名',
        single: true,
        value: customer.name,
        name: 'name'
      },
      {
        title: '电话',
        items: customer.phones.map(mapper)
      },
      {
        title: '部门',
        items: customer.departments.map(mapper)
      },
      {
        title: '职位',
        items: customer.jobs.map(mapper)
      }
    ],
    fields2: [
      {
        title: '邮箱',
        items: customer.emails.map(mapper)
      },
      {
        title: '公司',
        items: customer.companys.map(mapper)
      },
      {
        title: '地址',
        items: customer.addresses.map(mapper)
      }
    ]
  }
}

export function createCustomerFromFields({
  fields1,
  fields2
}: fields): Customer {
  const mapper = e => ({ label: e.label, value: e.value })
  return {
    name: fields1[0].value,
    groups: [],
    currentGroup: '',
    addresses: fields2[2].items.map(mapper),
    phones: fields1[1].items.map(mapper),
    emails: fields2[0].items.map(mapper),
    departments: fields1[2].items.map(mapper),
    jobs: fields1[3].items.map(mapper),
    companys: fields2[1].items.map(mapper)
  }
}


export function createFieldsFromCardResp(cardInfo: CardInfo): fields {
  return {
    fields1: [
      {
        title: '姓名',
        single: true,
        value: cardInfo.name,
        name: 'name'
      },
      {
        title: '电话',
        items: [
          ...cardInfo.tel_work.map((e, i) => {
            if (i === 0) {
              return {
                label: '座机',
                value: e
              }
            } else {
              return {
                label: '座机' + i,
                value: e
              }
            }
          }),
          ...cardInfo.tel_cell.map((e, i) => {
            if (i === 0) {
              return {
                label: '手机',
                value: e
              }
            } else {
              return {
                label: '手机' + i,
                value: e
              }
            }
          })
        ]
      },
      {
        title: '部门',
        items: cardInfo.department.map((e, i) => {
          if (i === 0) {
            return {
              label: '部门',
              value: e
            }
          } else {
            return {
              label: '部门' + i,
              value: e
            }
          }
        })
      },
      {
        title: '职位',
        items: cardInfo.title.map((e, i) => {
          if (i === 0) {
            return {
              label: '职位',
              value: e
            }
          } else {
            return {
              label: '职位' + i,
              value: e
            }
          }
        })
      }
    ],
    fields2: [
      {
        title: '邮箱',
        items: cardInfo.email.map((e, i) => {
          if (i === 0) {
            return {
              label: '邮箱',
              value: e
            }
          } else {
            return {
              label: '邮箱' + i,
              value: e
            }
          }
        })
      },
      {
        title: '公司',
        items: cardInfo.company.map((e, i) => {
          if (i === 0) {
            return {
              label: '公司',
              value: e
            }
          } else {
            return {
              label: '公司' + i,
              value: e
            }
          }
        })
      },
      {
        title: '地址',
        items: cardInfo.addr.map((e, i) => {
          if (i === 0) {
            return {
              label: '地址',
              value: e
            }
          } else {
            return {
              label: '地址' + i,
              value: e
            }
          }
        })
      }
    ]
  }
}

