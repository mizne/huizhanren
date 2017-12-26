import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hz-field-add',
  template: `
    <div class="hz-field-add">
      <ion-icon class="hz-icon" name="add-circle"></ion-icon>
      <span class="hz-add-text">添加其他项目</span>
    </div>
    
  `,
})

export class HzFieldAddComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}