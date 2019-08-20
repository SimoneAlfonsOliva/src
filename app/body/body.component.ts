import { Component, Output, EventEmitter, Input} from '@angular/core';
import { datiDelMeseModel } from './table/datiDelMese.model';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent {
 @Output() datiAFoot= new EventEmitter<datiDelMeseModel>();
 @Input() mese:number=0;
 @Input() anno:number=0;

 trasportaAFoot(event:datiDelMeseModel){
   this.datiAFoot.emit(event);
  //  console.log('evento in body component triggerato');
 }
}
