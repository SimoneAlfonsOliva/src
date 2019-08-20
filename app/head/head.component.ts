import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {
  @Output() eventoCambioData= new EventEmitter<{mese:number, anno: number}>();
  nome:string;
  scelto:boolean=false;
  constructor() { }
  anno=CalendarService.getFullYear();
  mese=CalendarService.getMonth();

  ngOnInit() {
    this.nome='Simone Alfonso Oliva';
  }
  cambiaScelto(value:boolean){
    this.scelto=value;
  }
  
  cambiaMese(nuovoMese:number){
    if(this.anno== CalendarService.getFullYear() && nuovoMese>CalendarService.getMonth()+1)
      return;
    if(nuovoMese<1){
      this.mese=11;
      this.anno--;
    }
    else
      if(nuovoMese>11){
        this.mese=0;
        this.anno++;
      }
      else
        this.mese=nuovoMese;
     const mese=this.mese;
     const anno=this.anno;
    this.eventoCambioData.emit({mese,anno});
  }

}
