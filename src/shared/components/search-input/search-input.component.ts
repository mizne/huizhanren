import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'hz-search-input',
  templateUrl: './search-input.component.html'
})
export class HzSearchInputComponent implements OnInit {
  searchControl: FormControl = new FormControl('')

  @Input() searchSub: Subject<string>
  @Input() debounceTime: number
  @Input() placeholder: string

  private ensureSearchSub: Subject<void> = new Subject<void>()

  constructor() {}

  ngOnInit() {
    Observable.merge(
      // this.searchControl.valueChanges.debounceTime(this.debounceTime || 3e3),
      this.ensureSearchSub.asObservable().map(() => this.searchControl.value)
    )
    .subscribe(this.searchSub)
  }

  enterSearch() {
    this.ensureSearchSub.next()
  }
}
