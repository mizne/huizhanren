import { Customer } from './customer.model'
import { phoneRe } from '../services/utils'

export interface SmsTemplate {
  id?: string
  label: string
  preview: string
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

export class SingleSendSmsContext {
  static TEMPLATE_VARIABLES = [
    '展商名称', // 展商名称()，
    '展位号', // 展位号()，
    '专业买家姓名', // 专业买家姓名()，
    '专业买家职务', // 专业买家职务()，
    '专业买家公司' // 专业买家公司()
  ]

  static VARIABLE_RE = /\$\{([^}]+)\}/g

  constructor(
    private customer: Customer,
    private companyName: string,
    private boothNo: string,
    private phone: string,
    private template: SmsTemplate
  ) {}

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
            accu['专业买家职务'] = this.customer.jobs[0].label
          } else {
            accu['专业买家职务'] = `未知头衔`
          }
        }
        if (curr === '专业买家公司') {
          if (this.customer.companys.length > 0) {
            accu['专业买家公司'] = this.customer.companys[0].label
          } else {
            accu['专业买家公司'] = `未知公司`
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
        return templateParams[c]
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

export class BatchSendSmsContext {
  constructor(
    private customers: Customer[],
    private companyName: string,
    private boothNo: string,
    private template: SmsTemplate
  ) {}

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
      const sendContext = new SingleSendSmsContext(
        e.customer,
        this.companyName,
        this.boothNo,
        e.phone,
        this.template
      )
      return {
        phone: e.phone,
        content: sendContext.computeTemplateParams()
      }
    })

    return smsContents
  }
}

export const SMS_TEMPLATE_BASE_URL = 'http://t.cn'
