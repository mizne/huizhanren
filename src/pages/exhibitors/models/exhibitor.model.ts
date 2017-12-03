export class Exhibitor {
  id?: string
  name?: string
  logo?: string
  booth?: string
  industry?: string
  area?: string
  heat?: number
}

export interface ExhibitorFilter {
  area: string,
  type: string,
  key: string
}

export interface Portray {
  id?: string
  name?: string
}

export enum ListStatus {
  EXHIBITOR,
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
