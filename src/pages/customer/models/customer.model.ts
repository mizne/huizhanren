export enum CustomerPateStatus {
  LISTABLE,
  EDITABLE,
  DETAILABLE,
  MANAGEABLE,
  CREATEABLE
}

export enum CustomerPageManageableStatus {
  SMS,
  GROUP,
  EMAIL
}

export class Customer {
  id?: string
  groups?: string[]
  currentGroup?: string
  name?: string
  selected?: boolean
  phones?: SubField[]
  emails?: SubField[]
  addresses?: SubField[]
  departments?: SubField[]
  jobs?: SubField[]
  companys?: SubField[]
  imageUrl?: string
  imageBehindUrl?: string
  haveCalled?: boolean
  haveSendEmail?: boolean
  haveSendMsg?: boolean

  static convertFromResp(resp: CustomerResp): Customer {
    return {
      id: resp.RecordId,
      groups: resp.GroupInfo,
      name: resp.Name,
      selected: false,
      phones: resp.Phone.map(e => ({ ...e, selected: true })),
      emails: resp.Email.map(e => ({ ...e, selected: true })),
      addresses: resp.Address.map(e => ({ ...e, selected: true })),
      departments: resp.Department.map(e => ({ ...e, selected: true })),
      jobs: resp.Job.map(e => ({ ...e, selected: true })),
      companys: resp.Company.map(e => ({ ...e, selected: true })),
      imageUrl: resp.Image,
      imageBehindUrl: resp.BackImage,
      haveCalled: !!resp.HaveCalled,
      haveSendEmail: !!resp.HaveSendEmail,
      haveSendMsg: !!resp.HaveSendMsg
    }
  }
}

export interface SubField {
  label: string
  value: string
  selected?: boolean
}


export interface CustomerResp {
  RecordId: string
  GroupInfo: string[]
  Name: string
  Phone: SubFieldResp[]
  Email: SubFieldResp[]
  Address: SubFieldResp[]
  Department: SubFieldResp[]
  Job: SubFieldResp[]
  Company: SubFieldResp[]
  Image: string
  BackImage: string
  HaveCalled?: boolean
  HaveSendEmail?: boolean
  HaveSendMsg?: boolean
}

export interface SubFieldResp {
  label: string
  value: string
}


