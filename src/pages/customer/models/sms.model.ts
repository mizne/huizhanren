import { Customer } from './customer.model'
import { phoneRe } from '../services/utils'

export interface SmsTemplate {
  id?: string
  label: string
  preview: string
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
    private boothNo: string
  ) {}

  computeTemplateParams(preview): SmsTemplateParams {
    const matches = preview.match(SingleSendSmsContext.VARIABLE_RE)
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

  computeTemplate(
    preview: string
  ): { params: SmsTemplateParams; content: string } {
    const templateParams = this.computeTemplateParams(preview)
    const content = preview.replace(SingleSendSmsContext.VARIABLE_RE, function(
      _,
      c
    ) {
      return templateParams[c]
    })
    return {
      params: templateParams,
      content
    }
  }
}

export class BatchSendSmsContext {
  constructor(
    private customers: Customer[],
    private companyName: string,
    private boothNo: string
  ) {}

  public getCustomerIds(): string[] {
    return this.customers.map(e => e.id)
  }

  public computeRequestParams(preview: string): SmsContent[] {
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
        this.boothNo
      )
      return {
        phone: e.phone,
        content: sendContext.computeTemplateParams(preview)
      }
    })

    return smsContents
  }
}

export interface SmsTemplateParams {
  展商名称?: string
  展位号?: string
  专业买家姓名?: string
  专业买家职务?: string
  专业买家公司?: string
}

export const SMS_TEMPLATE_BASE_URL = 'http://t.cn'
