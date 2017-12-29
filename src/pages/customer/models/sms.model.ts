export interface SmsTemplate {
  id?: string
  label: string
  preview: string
}

export interface SmsContent {
  phone: string
  content: SmsTemplateParams
}

export const SmsTemplateVariables = [
  'exhibitorName', // 展商名称()，
  'exhibitorBoothNo', // 展位号()，
  'visitorName', // 专业买家姓名()，
  'visitorTitle', // 专业买家职务()，
  'visitorCompanyName', // 专业买家公司()
]

export interface SmsTemplateParams {
  exhibitorName?: string
  exhibitorBoothNo?: string
  visitorName?: string
  visitorTitle?: string
  visitorCompanyName?: string
}

export const SMS_TEMPLATE_BASE_URL = 'http://t.cn'
