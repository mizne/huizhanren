import { Component, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'

import { DestroyService } from '../../../providers/destroy.service'

export interface SelectOption {
  label: string
  value: string
}

@Component({
  selector: 'hz-selector',
  templateUrl: './selector.component.html',
  providers: [DestroyService]
})
export class HzSelectorComponent {
  selectedLabel: string

  showPopover: boolean = false

  @Input() options: SelectOption[]
  @Input() selectedValueSub: Subject<string>

  constructor(private destroyService: DestroyService) {}
  ngOnInit() {
    this.selectedValueSub.asObservable()
    .takeUntil(this.destroyService)
    .subscribe((value) => {
      const option = this.options.find(e => e.value === value)
      this.selectedLabel = option.label
    })

    this.selectedValueSub.next(this.options[0].value)
  }

  ensureSelect(option: SelectOption) {
    this.showPopover = false
    this.selectedValueSub.next(option.value)
  }

  togglePopover() {
    this.showPopover = !this.showPopover
  }

  closePopover() {
    this.showPopover = false
  }
}
