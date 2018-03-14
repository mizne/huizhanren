import { Component, OnInit, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'

import { DestroyService } from '../../../providers/destroy.service'

export enum GridFilterType {
  VISITOR,
  EXHIBITOR
}

@Component({
  selector: 'hz-grid-filter',
  templateUrl: 'grid-filter.component.html',
  providers: [DestroyService]
})
export class HzGridFilterComponent implements OnInit {
  visitor = GridFilterType.VISITOR
  exhibitor = GridFilterType.EXHIBITOR

  @Input() type: GridFilterType
  @Input() count: number
  @Input() filterSub: Subject<any>
  @Input() showSearch: boolean
  @Input() placeholder: string

  areaSelectSub: Subject<string> = new Subject<string>()
  typeSelectSub: Subject<string> = new Subject<string>()
  sortSelectSub: Subject<string> = new Subject<string>()

  searchSub: Subject<string> = new Subject<string>()

  areaOptions: any[]
  typeOptions: any[]
  sortOptions: any[]

  @Input()
  set filterOptions(options: any[][]) {
    this.areaOptions = options[0]
    this.typeOptions = options[1]
    this.sortOptions = options[2]
  }

  constructor(private destroyService: DestroyService) {}

  ngOnInit() {
    this.initAreaSelectorChange()
    this.initTypeSelectorChange()
    this.initSearchChange()
  }

  private initAreaSelectorChange(): void {
    this.areaSelectSub
      .takeUntil(this.destroyService)
      .withLatestFrom(this.typeSelectSub.startWith(''), (area, type) => ({
        area,
        type
      }))
      .subscribe(this.filterSub)
  }

  private initTypeSelectorChange(): void {
    this.typeSelectSub
      .takeUntil(this.destroyService)
      .withLatestFrom(this.areaSelectSub.startWith(''), (type, area) => ({
        area,
        type
      }))
      .subscribe(this.filterSub)
  }

  private initSearchChange(): void {
    this.searchSub
      .asObservable()
      .map(searchText => ({ key: searchText }))
      .subscribe(this.filterSub)
  }
}
