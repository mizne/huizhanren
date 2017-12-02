import { Component, OnInit, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'

import { RecommendFilter } from '../../recommend'

@Component({
  selector: 'hz-recommend-filter',
  templateUrl: 'recommend-filter.component.html',
})
export class RecommendFilterComponent implements OnInit {
  @Input() filterSub: Subject<RecommendFilter>

  areaSelectSub: Subject<string> = new Subject<string>()
  typeSelectSub: Subject<string> = new Subject<string>()

  searchSub: Subject<string> = new Subject<string>()

  areaOptions = [
    {
      label: '不限区域',
      value: '0'
    },
    {
      label: '区域一',
      value: '1'
    },
    {
      label: '区域二',
      value: '2'
    }
  ]

  typeOptions = [
    {
      label: '不限分类',
      value: '0'
    },
    {
      label: '分类一',
      value: '1'
    },
    {
      label: '分类二',
      value: '2'
    }
  ]

  constructor() {}

  ngOnInit() {
    this.searchSub.asObservable()
    .do(() => {
      // 初始化 多个下拉框的选中值
      this.areaSelectSub.next(this.areaOptions[0].value)
      this.typeSelectSub.next(this.typeOptions[0].value)
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

  ensureSearch(searchText: string) {
    console.log(searchText)
  }
}
