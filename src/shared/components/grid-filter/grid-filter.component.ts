import { Component, OnInit, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'


@Component({
  selector: 'hz-grid-filter',
  templateUrl: 'grid-filter.component.html',
})
export class HzGridFilterComponent implements OnInit {
  @Input() filterSub: Subject<any>
  @Input() showSearch: boolean

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

  constructor() {}

  ngOnInit() {
    this.searchSub.asObservable()
    .do(() => {
      // 初始化 多个下拉框的选中值
      this.areaSelectSub.next(this.areaOptions[0].value)
      this.typeSelectSub.next(this.typeOptions[0].value)
      this.sortSelectSub.next(this.typeOptions[0].value)
    })
    .withLatestFrom(
      this.areaSelectSub,
      (searchText, selectArea) => ({
        key: searchText,
        area: selectArea
      })
    )
    .withLatestFrom(
      this.typeSelectSub,
      ({key, area}, selectedType) => ({
        key,
        area,
        type: selectedType
      })
    )
    .subscribe(this.filterSub)
  }
}
