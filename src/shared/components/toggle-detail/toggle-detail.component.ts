import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'hz-toggle-detail',
  templateUrl: 'toggle-detail.component.html'
})
export class HzToggleDetailComponent {
  @Input() collapse: boolean

  @Output() toggle: EventEmitter<void> = new EventEmitter<void>()

  handleClick() {
    this.toggle.emit()
  }
}
