import { Directive, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[clickOutside]' })
export class ClickOutSideDirective {
  constructor(private el: ElementRef) {
  }

  @Output() clickOutside: EventEmitter<void> = new EventEmitter<void>()

  @HostListener('document:click', ['$event.target']) onclick(targetElement) {

    const clickedInside = this.el.nativeElement.contains(targetElement);
    if (!clickedInside) {
        this.clickOutside.emit();
    }
  }
}
