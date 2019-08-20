import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { datiDelMeseModel } from '../body/table/datiDelMese.model';
import { InvioService } from '../body/table/riga/invio.service';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-foot',
  templateUrl: './foot.component.html',
  styleUrls: ['./foot.component.css']
})
export class FootComponent implements OnInit, DoCheck {

  ngDoCheck(): void {
    this.mostraRiepilogoMensile();
    // this.invio.enroll(this.datiMensili);
  }

  @Input() datiMensili : datiDelMeseModel;
  oreDiLavoro= '0';
  giorniDiMalattia=0;
  giorniDiReperibilita=0;
  permessiTotali=0;
  oreDiRol= '0';
  giorniDiLavoro=0;
  giorniDiFerie=0;
  oreDiIntervento= '0';
  oreDiPermesso= '0';
  oreDiStraordinario= '0';
  mese=CalendarService.getMonth();
  anno=CalendarService.getFullYear();
  
  constructor(private invio:InvioService){}

  mostraRiepilogoMensile(){
    // console.log('mostra dati mensili',this.datiMensili);
  this.giorniDiFerie= this.datiMensili.giorniFerie;
  this.giorniDiLavoro= this.datiMensili.giorniLavorati;
  this.giorniDiMalattia=this.datiMensili.giorniMalattia;
  this.giorniDiReperibilita=this.datiMensili.giorniReperibilita ;
  this.oreDiIntervento=this.datiMensili.oreIntervento;
  this.oreDiLavoro=this.datiMensili.oreLavorate ;
  this.oreDiPermesso=this.datiMensili.orePermessi;
  this.oreDiRol=this.datiMensili.oreRol;
  this.oreDiStraordinario=this.datiMensili.oreStraordinario;
  this.permessiTotali=this.datiMensili.totalePermessi;
  }

  ngOnInit() {
    this.mostraRiepilogoMensile();
  }
}
