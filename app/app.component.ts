import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { datiDelMeseModel } from './body/table/datiDelMese.model';
import { isUndefined } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @Output() trasferisciNuovaData= new EventEmitter<{mese:number, anno:number}>();
  datiMensili= new datiDelMeseModel();
  mese=0;
  anno=0;
  admin:boolean;

  ngOnInit(): void {
   //console.log(this.admin);
  }

  inviaAFoot(evento: datiDelMeseModel){
    // console.log('evento in app component triggerato', evento);
    this.datiMensili=evento;
    // console.log(this.datiMensili);
  }
  
  inviaDatiMensili(){
    //  console.log('dati mensili da app component');
    return this.datiMensili;
  }

  cambiaDataCorrente(evento:{mese:number, anno:number} ){
    this.mese=evento.mese;
    this.anno=evento.anno;
  }
  attivazioneAdmin(){
    if(isUndefined(this.admin))
    return -1;
    return this.admin;
  }
}
