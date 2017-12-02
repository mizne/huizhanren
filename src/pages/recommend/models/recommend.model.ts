export class Customer {
  id?: string
  name?: string
  title?: string
  company?: string
  industry?: string
  area?: string
}

export class Recommend extends Customer {
}

export interface Portray {
  id?: string
  name?: string
}

export enum ListStatus {
  RECOMMEND,
  MATCHER
}

export enum PageStatus {
  LIST,
  DETAIL
}

export enum ListHeaderEvent {
  BATCH_INVITE,
  BATCH_HIDDEN,
  BATCH_ACCEPT,
  BATCH_REFUSE,
  BATCH_CANCEL,
  BATCH_DELETE
}
