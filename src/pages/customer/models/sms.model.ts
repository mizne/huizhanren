export interface SmsTemplate {
  id?: string
  label: string
  preview: string
}

export interface SmsContent {
  phone: string
  content: string[]
}

export const SMS_TEMPLATE_BASE_URL = 'http://t.cn'
