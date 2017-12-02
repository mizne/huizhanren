export interface Customer {
  id?: string
  groups: string[]
  currentGroup?: string
  name: string
  selected?: boolean

  phones: SubField[]
  emails: SubField[]
  addresses: SubField[]
  departments: SubField[]
  jobs: SubField[]
  companys: SubField[]

  imageUrl?: string
  imageBehindUrl?: string

  haveCalled?: boolean
  haveSendEmail?: boolean
  haveSendMsg?: boolean
}

export interface SubField {
  label: string
  value: string
  selected?: boolean
}


