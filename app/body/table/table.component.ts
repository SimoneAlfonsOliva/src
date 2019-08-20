import { Component, OnInit, Output, EventEmitter, Input, DoCheck} from '@angular/core';
import { CalendarService } from 'src/app/calendar.service';
import { datiGiornalieriModel } from './riga/datiGiornalieri.model';
import { datiDelMeseModel } from './datiDelMese.model';
import { isUndefined, isNull } from 'util';
import { TimeSheet } from './modelloTimesheet.model';
import { InvioService } from './riga/invio.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit,DoCheck {
  
  giorni:number[]=[];
  @Output() inviaABody = new EventEmitter<datiDelMeseModel>();
  @Output() inviaNuovaData= new EventEmitter<{mese:number, anno:number}>();
  private datiDelMese= new datiDelMeseModel();
  oreTotali=0;
  @Input() mese:number=0;
  @Input() anno:number=0;
  inviabile:boolean;
  private ts= new TimeSheet();

  convalida(){
    let giorniNonRegistrati:number[]=new Array();
    for (let i = 0; i < this.ts.registroGiornaliero.length; i++) {
      //console.log(this.ts.registroGiornaliero[i])
      if(isUndefined(this.ts.registroGiornaliero[i]))
      giorniNonRegistrati.push(i+1);
    }
    if(giorniNonRegistrati.length>0){
      window.alert('Non puoi convalidare il timesheet perchè i seguenti giorni non sono stati compilati: '+ giorniNonRegistrati.toString());
      return;
    }
    this.invio.enroll(this.ts)
    .subscribe(data => console.log('Invio modello mensile Riuscito', data),
    error => console.log('Errore: ', error));
  }

  constructor(private invio:InvioService){}
  
  verificaConvalida(){
    //console.log('mese e anno da tableComponent', this.mese, this.anno);
    this.inviabile=(this.mese !== CalendarService.getMonth() || this.anno !== CalendarService.getFullYear());
  }

  ngDoCheck(): void {
    this.verificaConvalida();
  }

  ngOnInit(): void {
    for (let id = 0; id < CalendarService.getLastDayOfCurrentMonth(); id++) {
      this.giorni[id]= 0;
    }
    this.mese=CalendarService.getMonth();
    this.anno=CalendarService.getFullYear();
    this.verificaConvalida();
  }

  trackGiorniAggiunti(index: number, giorni:number):number{
    return giorni;
  }

  get oreLavoro():number{
    // console.log('oreLavoro', Number.parseInt(this.datiDelMese.oreLavorate.substr(0,2)))
    return Number.parseInt(this.datiDelMese.oreLavorate.substr(0,2));
  }

  get minutiLavoro(): number{
    // console.log('minutiLavoro', Number.parseInt(this.datiDelMese.oreLavorate.substr(3,4)) )
    return Number.parseInt(this.datiDelMese.oreLavorate.substr(3,4));
  }

  get oreStraordinario(){
    // console.log('oreStraordinario', Number.parseInt(this.datiDelMese.oreStraordinario.substr(0,2))  )
    return Number.parseInt(this.datiDelMese.oreStraordinario.substr(0,2))
  }

  get minutiStraordinario(){
    // console.log('minutiStraordinario', Number.parseInt(this.datiDelMese.oreStraordinario.substr(3,4)) )
    return Number.parseInt(this.datiDelMese.oreStraordinario.substr(3,4))
  }

  get oreRol(){
    // console.log('oreRol', Number.parseInt(this.datiDelMese.oreRol.substr(0,2)))
    return Number.parseInt(this.datiDelMese.oreRol.substr(0,2));
  }

  get minutiRol(){
    // console.log('minutiRol',Number.parseInt(this.datiDelMese.oreRol.substr(3,4)) )
    return Number.parseInt(this.datiDelMese.oreRol.substr(3,4));
  }

  get orePermessi(){
    // console.log('orePermessi',Number.parseInt(this.datiDelMese.orePermessi.substr(0,2)) )
    return Number.parseInt(this.datiDelMese.orePermessi.substr(0,2));
  }

  get minutiPermessi(){
    // console.log('minutiPermessi',Number.parseInt(this.datiDelMese.orePermessi.substr(3,4)) )
    return Number.parseInt(this.datiDelMese.orePermessi.substr(3,4));
  }

  get oreIntevento(){
    // console.log('oreIntevento', Number.parseInt(this.datiDelMese.oreIntervento.substr(0,2)) )
    return Number.parseInt(this.datiDelMese.oreIntervento.substr(0,2));
  }

  get minutiIntevento(){
    // console.log('minutiIntevento', Number.parseInt(this.datiDelMese.oreIntervento.substr(3,4))  )
    return Number.parseInt(this.datiDelMese.oreIntervento.substr(3,4));
  }

  private calcolaOrario(orario:string, oreAvanzate:number , minutiAvanzati:number){
    let ore = !isUndefined(orario) ? Number.parseInt(orario.substr(0,2)): 0;
    let minuti = !isUndefined(orario) ? Number.parseInt(orario.substr(2,4)) : 0;
    //console.log(orario.substr(3,4), orario.substr(2,4), orario.substr(3,5), minuti, minutiAvanzati);
    isNaN(ore)? ore=0 : null;
    isNaN(minuti)? minuti=0 : null;
    // console.log(ore, minuti, oreAvanzate, minutiAvanzati);
    let minutiDaAggiungere=0;
    let oreDaAggiungere=0;
    if(minuti + minutiAvanzati >=60){
      oreDaAggiungere++;
      minutiDaAggiungere=minuti + minutiAvanzati - 60;
    }else{
      minutiDaAggiungere=minuti + minutiAvanzati;
    }
    oreDaAggiungere+= oreAvanzate + ore;
    // console.log(ore, oreAvanzate, oreDaAggiungere);
    // console.log(oreDaAggiungere + ':' + (minutiDaAggiungere<=9? '0'+minutiDaAggiungere : minutiDaAggiungere ));
    return oreDaAggiungere + ':' + (minutiDaAggiungere<=9? '0'+minutiDaAggiungere : minutiDaAggiungere );
  }

  aggiungiOrario(orario:string, tipo:string, giorno:number){
    //console.log(tipo);
    switch (tipo) {
      case 'lavoro':
       this.datiDelMese.oreLavorate= this.calcolaOrario(orario, this.oreLavoro, this.minutiLavoro);    
       
      break;
      case 'straordinario':
       this.datiDelMese.oreStraordinario= this.calcolaOrario(orario, this.oreStraordinario, this.minutiStraordinario); 
          
      break;
      case 'rol':
       this.datiDelMese.oreRol= this.calcolaOrario(orario, this.oreRol, this.minutiRol);  
        
      break;
      case 'permessi':
       this.datiDelMese.orePermessi= this.calcolaOrario(orario, this.orePermessi, this.minutiPermessi); 
          
      break;
      case 'intervento':
       this.datiDelMese.oreIntervento= this.calcolaOrario(orario, this.oreIntevento, this.minutiIntevento);   
       
      break;
      default:
        throw new Error('Error: '+ tipo + 'non è un comando riconosciuto, salvataggio delle ore del giorno '+ giorno + ' annullati' );
      break;
    }
  }

  aggiungiGiorno(tipo:string, giorno:number){
    switch (tipo) {
      case 'ferie':
        this.datiDelMese.giorniFerie++;
      break;
      case 'lavorato':
        this.datiDelMese.giorniLavorati++;
      break;
      case 'malattia':
        this.datiDelMese.giorniMalattia++;
      break;
      case 'reperibilita':
        this.datiDelMese.giorniReperibilita++;
      break;
      case 'permessi':
        this.datiDelMese.totalePermessi++;
      break;
      default:
          throw new Error('Error: '+ tipo + 'non è un comando riconosciuto, salvataggio dei dati del giorno '+ giorno + ' annullati' );
      break;
    }
  }

  calcolaOreTotali(evento:datiGiornalieriModel){
    if(evento.giorno < 1){
      window.alert("è stato rilevato un giorno negativo: " + evento.giorno + ', la registrazione dei dati associata è annullata');
      return;
    }
    //console.log(evento.reperibilita, evento.oreIntervento);
    if (evento.mese== CalendarService.getMonth() && evento.anno==CalendarService.getFullYear()) {
    evento.oreIntervento!== '0' ? this.aggiungiOrario(evento.oreIntervento, 'intervento' , evento.giorno ): null;
    evento.oreLavorate!== '0' ? this.aggiungiOrario(evento.oreLavorate, 'lavoro', evento.giorno ): null;
    evento.orePermessi!== '0' ? this.aggiungiOrario(evento.orePermessi, 'permessi', evento.giorno): null;
    evento.oreROL!== '0' ? this.aggiungiOrario(evento.oreROL, 'rol' , evento.giorno): null;
    evento.oreStraordinario!== '0' ? this.aggiungiOrario(evento.oreStraordinario, 'straordinario' , evento.giorno): null;
    evento.ferie ? this.aggiungiGiorno('ferie', evento.giorno) : null;
    evento.lavorato ? this.aggiungiGiorno('lavorato', evento.giorno): null;
    evento.malattia ? this.aggiungiGiorno('malattia', evento.giorno): null;
    evento.reperibilita ? this.aggiungiGiorno('reperibilita', evento.giorno): null;
    evento.permesso ? this.aggiungiGiorno('permessi', evento.giorno) : null;
    // console.log(this.datiDelMese);
    this.inviaABody.emit(this.datiDelMese);
    this.ts.riepilogoMensile=this.datiDelMese;
    }
    // console.log('evento dati del mese inviato da table', this.datiDelMese.totalePermessi);
  }

  aggiuntaATimeSheet(evento:datiGiornalieriModel){
    this.ts.registroGiornaliero.splice(evento.giorno-1,1,evento);
    //console.log(this.ts);
  }
}
