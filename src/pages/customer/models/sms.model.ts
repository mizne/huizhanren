import { Customer } from './customer.model'
import { phoneRe } from '../services/utils'

export class SmsTemplate {
  id?: string
  label?: string
  preview: string

  static convertFromResp(resp: SmsTemplateResp): SmsTemplate {
    return {
      id: resp.RecordId,
      label: resp.Name,
      preview: resp.Content
    }
  }

  static convertFromModal(model: SmsTemplate): SmsTemplateResp {
    return {
      Name: model.label,
      Content: model.preview,
      IsActive: true,
      Type: '1'
    }
  }
}

export interface SmsTemplateResp {
  RecordId?: string
  Name?: string
  Content?: string
  IsActive: boolean
  Type: string
}

export interface SmsTemplateParams {
  展商名称?: string
  展位号?: string
  专业买家姓名?: string
  专业买家职务?: string
  专业买家公司?: string
}

export interface SmsContent {
  phone: string
  content: SmsTemplateParams
}

export interface SingleSendSmsOptions {
  customer: Customer
  companyName: string
  boothNo: string
  phone: string
  template: SmsTemplate
}

export class SingleSendSmsContext {
  static TEMPLATE_VARIABLES = [
    '展商名称', // 展商名称()，
    '展位号', // 展位号()，
    '专业买家姓名', // 专业买家姓名()，
    '专业买家职务', // 专业买家职务()，
    '专业买家公司' // 专业买家公司()
  ]

  static VARIABLE_RE = /\$\{([^}]+)\}/g

  private customer: Customer
  private companyName: string
  private boothNo: string
  private phone: string
  private template: SmsTemplate

  constructor(options: SingleSendSmsOptions) {
    this.customer = options.customer
    this.companyName = options.companyName
    this.boothNo = options.boothNo
    this.phone = options.phone
    this.template = options.template
  }

  public getTemplate(): SmsTemplate {
    return this.template
  }

  public getCustomer(): Customer {
    return this.customer
  }

  public computeTemplateParams(): SmsTemplateParams {
    const matches = this.template.preview.match(
      SingleSendSmsContext.VARIABLE_RE
    )
    if (!matches) {
      return {}
    }
    const variableNames = matches.map(e => e.slice(2, -1))
    let initV: SmsTemplateParams = {}
    const templateParams: SmsTemplateParams = variableNames.reduce(
      (accu, curr) => {
        if (curr === '展商名称') {
          accu['展商名称'] = this.companyName
        }
        if (curr === '展位号') {
          accu['展位号'] = this.boothNo
        }
        if (curr === '专业买家姓名') {
          accu['专业买家姓名'] = this.customer.name
        }
        if (curr === '专业买家职务') {
          if (this.customer.jobs.length > 0) {
            accu['专业买家职务'] = this.customer.jobs[0].value
          } else {
            accu['专业买家职务'] = ``
          }
        }
        if (curr === '专业买家公司') {
          if (this.customer.companys.length > 0) {
            accu['专业买家公司'] = this.customer.companys[0].value
          } else {
            accu['专业买家公司'] = ``
          }
        }
        return accu
      },
      initV
    )
    return templateParams
  }

  public computeTemplate(): { params: SmsTemplateParams; content: string } {
    const templateParams = this.computeTemplateParams()
    const content = this.template.preview.replace(
      SingleSendSmsContext.VARIABLE_RE,
      function(_, c) {
        return templateParams[c] || ''
      }
    )
    return {
      params: templateParams,
      content
    }
  }

  public computeRequestParams(): SmsContent[] {
    return [
      {
        phone: this.phone,
        content: this.computeTemplateParams()
      }
    ]
  }
}

export interface BatchSendSmsOptions {
  customers: Customer[]
  companyName: string
  boothNo: string
  template: SmsTemplate
}

export class BatchSendSmsContext {
  private customers: Customer[]
  private companyName: string
  private boothNo: string
  private template: SmsTemplate
  constructor(options: BatchSendSmsOptions) {
    this.customers = options.customers
    this.companyName = options.companyName
    this.boothNo = options.boothNo
    this.template = options.template
  }

  public getCustomerIds(): string[] {
    return this.customers.map(e => e.id)
  }

  public getTemplate(): SmsTemplate {
    return this.template
  }

  public computeRequestParams(): SmsContent[] {
    const phoneToSendWithCustomers: {
      phone: string
      customer: Customer
    }[] = this.customers.reduce((accu, curr) => {
      const phones = curr.phones.filter(
        e => e.selected && phoneRe.test(e.value)
      )
      accu.push(...phones.map(f => ({ phone: f.value, customer: curr })))
      return accu
    }, [])

    const smsContents: SmsContent[] = phoneToSendWithCustomers.map(e => {
      const sendContext = new SingleSendSmsContext({
        customer: e.customer,
        companyName: this.companyName,
        boothNo: this.boothNo,
        phone: e.phone,
        template: this.template
      })
      return {
        phone: e.phone,
        content: sendContext.computeTemplateParams()
      }
    })

    return smsContents
  }
}

export const SMS_TEMPLATE_BASE_URL = '//t.cn'
