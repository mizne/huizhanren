import { Customer } from './customer.model'

export interface SmsTemplate {
  id?: string
  label: string
  preview: string
}

export interface SmsContent {
  phone: string
  content: SmsTemplateParams
}

export class SendSmsContext {
  static TEMPLATE_VARIABLES = [
    'exhibitorName', // 展商名称()，
    'exhibitorBoothNo', // 展位号()，
    'visitorName', // 专业买家姓名()，
    'visitorTitle', // 专业买家职务()，
    'visitorCompanyName' // 专业买家公司()
  ]

  constructor(
    private customer: Customer,
    private companyName: string,
    private boothNo: string
  ) {}

  computeTemplateParams(preview): SmsTemplateParams {
    const variableNames = preview
      .match(/\$\{([^}]+)\}/g)
      .map(e => e.slice(2, -1))
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

  computeTemplateContent(preview: string): string {
    const templateParams = this.computeTemplateParams(preview)
    const content = preview.replace(/\$\{([^}]+)\}/g, function(m, c) {
      return templateParams[c]
    })
    return content
  }
}

export interface SmsTemplateParams {
  exhibitorName?: string
  exhibitorBoothNo?: string
  visitorName?: string
  visitorTitle?: string
  visitorCompanyName?: string
}

export const SMS_TEMPLATE_BASE_URL = 'http://t.cn'
