import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { HzSearchInputComponent } from './components/search-input/search-input.component'
import { HzSelectorComponent } from './components/selector/selector.component'
import { HzRateComponent } from './components/rate/rate.component'
import { HzGridHeaderComponent } from './components/grid-header/grid-header.component'
import { HzGridFilterComponent } from './components/grid-filter/grid-filter.component'

import { HzLoggerItemComponent } from './components/logger-item/logger-item.component'
import { HzLoggerItemAddComponent } from './components/logger-item-add/logger-item-add.component'
import { HzLoggerListComponent } from './components/logger-list/logger-list.component'
import { HzToggleDetailComponent } from './components/toggle-detail/toggle-detail.component'

import { ClickOutSideDirective } from './directives/click-outside.directive'

const pipes = []

const components = [
  HzSearchInputComponent,
  HzSelectorComponent,
  HzRateComponent,
  HzGridHeaderComponent,
  HzGridFilterComponent,
  HzLoggerItemComponent,
  HzLoggerItemAddComponent,
  HzLoggerListComponent,
  HzToggleDetailComponent,
]

const directives = [ClickOutSideDirective]

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [...pipes, ...components, ...directives],
  providers: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ...pipes,
    ...components,
    ...directives
  ]
})
export class SharedModule {
}
