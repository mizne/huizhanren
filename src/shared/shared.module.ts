import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { HzSearchInputComponent } from './components/search-input/search-input.component'
import { HzSelectorComponent } from './components/selector/selector.component'

import { ClickOutSideDirective } from './directives/click-outside.directive'

const pipes = [
]

const components = [
  HzSearchInputComponent,
  HzSelectorComponent,
]

const directives = [
  ClickOutSideDirective,
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
      ...pipes,
      ...components,
      ...directives
    ],
    providers: [
    ],
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
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }
}
