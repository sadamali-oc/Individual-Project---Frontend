import { Component, input } from '@angular/core';
import { Widget } from '../../modules/dashboard';

@Component({
  selector: 'app-widget',
  imports: [],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.css'
  ,

  styles:`

  :host {


  display: block;
  border-radius: 16px;
}
`
})

export class WidgetComponent {


  data=input.required<Widget>();
  

}
