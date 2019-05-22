import { Component } from '@angular/core';

/**
 * Generated class for the AllComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'all',
  templateUrl: 'all.html'
})
export class AllComponent {

  text: string;

  constructor() {
    this.text = 'Hello world';
  }

}
