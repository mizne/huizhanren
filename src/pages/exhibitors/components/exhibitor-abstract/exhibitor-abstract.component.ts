import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'hz-exhibitor-abstract',
  templateUrl: 'exhibitor-abstract.component.html',
})
export class HzExhibitorAbstractComponent implements OnInit {

  @Output() invite: EventEmitter<void> = new EventEmitter<void>()
  constructor() {}

  productItems = [
    {
      id: '0',
      name: '产品名称'
    },
    {
      id: '1',
      name: '产品名称'
    },
    {
      id: '2',
      name: '产品名称'
    },
    {
      id: '3',
      name: '产品名称'
    },
    {
      id: '4',
      name: '产品名称'
    },
    {
      id: '5',
      name: '产品名称'
    }
  ]

  description = '上海联展软件技术有限公司是会展互联网、信息化及营销解决方案的领先服务商' +
  '。成立于2004年，总部位于上海，在长沙、广州等设有分支或代理机构。' +
  '联展正在为中国近50个行业1000场展会提供招展、招商专业联展正在为中国近50个行业1000场展会提供招展、招商专业联展正在为中国近50个行业1000场展会提供招展、招商专业联展正在为中国近50个行业1000场展会提供招展、招商专业联展正在为中国近50个行业1000场展会提供招展、招商专业联展正在为中国近50个行业1000场展会提供招展、招商专业联展正在为中国近50个行业1000场展会提供招展、招商专业'

  ngOnInit() {
  }

  ensureInvite() {
    this.invite.emit()
  }
}
