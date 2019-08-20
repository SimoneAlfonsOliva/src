import { Component, OnInit, Input, EventEmitter, Output, DoCheck } from '@angular/core';
import { CalendarService } from 'src/app/calendar.service';
import { RigaInJSONModel } from './rigaInJson/riga-in-JSON.model';
import { ProgettoModel } from './rigaInJson/progetto.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { OrarioMattinaValidator, OrarioMattinaSecondarioValidator } from './validatori/orarioMattina.validator';
import { OrarioPomeriggioValidator, OrarioPomeriggioSecondarioValidator } from './validatori/orarioPomeriggio.validator';
import { AssenzaGLValidator } from './validatori/AssenzaGL.validator';
import { InvioService } from './invio.service';
import { ReperibilitaModel } from './rigaInJson/reperibilità.model';
import { datiGiornalieriModel } from './datiGiornalieri.model';
import { isNull, isUndefined } from 'util';
import { modelloJson } from './modelloJSON.model';

@Component({
  selector: 'app-riga',
  templateUrl: './riga.component.html',
  styleUrls: ['./riga.component.css']
})

export class RigaComponent implements OnInit, DoCheck {
  // orari:string;
  inviato=false;
  oreLavoroFormattate:string;
  oreNonLavorate:string;
  oreStraordinario='0';
  oreIntervento=0;
  oreInterventoFormattate='0';
  oreRigaSecondarie=0;
  totOre=0;
  @Output() addGiorno= new EventEmitter<number>();
  @Input() giorno:number;
  @Output() invioDatiMensili= new EventEmitter<datiGiornalieriModel>();
  @Input() mese:number=CalendarService.getMonth();
  @Input() anno:number=CalendarService.getFullYear();
  meseCambiato:number;
  annoCambiato:number;
  tipiAssenze:string[];
  opzioniReperibilita:string[];
  clienti:string[];
  private modelloSalvataggio= new RigaInJSONModel();
  orarioLavoroForm: FormGroup;
  private modelloDatiGiornaliero= new datiGiornalieriModel();

  constructor(private fb:FormBuilder, private servizioDiInvio: InvioService ) {}
    
  reset(){
    this.totOre=0;
    this.oreRigaSecondarie=0;
    this.oreIntervento=0;
    this.inizioMattina.setValue('');
    this.fineMattina.setValue('');
    this.inizioPomeriggio.setValue('');
    this.finePomeriggio.setValue('');
    this.giornoSuccessivo.setValue(false);
    this.motivoAssenza.setValue('');
    this.inizioReperibilita.setValue('');
    this.fineReperibilita.setValue('');
    this.clientiEProgetti.setValue('');
    this.righeSecondarie.clear();
    this.interventiSecondari.clear();
    this.orarioLavoroForm.enable();
  }

  ngDoCheck(): void {
    //console.log('giorno', this.giorno ,this.giornoSuccessivo, this.giornoSuccessivo.value)
    
    if(this.mese !== this.meseCambiato || this.anno !== this.annoCambiato){
      this.annoCambiato=this.anno;
      this.meseCambiato=this.mese;
      this.reset();
      this.caricamento();
    }

    if(this.mese !== CalendarService.getMonth() || this.anno !== CalendarService.getFullYear()){
      this.inizioMattina.disable();
      this.inizioPomeriggio.disable();
      this.fineMattina.disable();
      this.finePomeriggio.disable();
      this.inizioReperibilita.disable();
      this.fineReperibilita.disable();
      this.motivoAssenza.disable();
      this.giornoSuccessivo.disable();
      this.clientiEProgetti.disable();
      this.righeSecondarie.disable();
      this.interventiSecondari.disable();
    }
   
  }

  segnaIDatiGiornalieri(){
    this.modelloDatiGiornaliero.anno=this.anno;
    this.modelloDatiGiornaliero.mese=this.mese;
    this.modelloDatiGiornaliero.giorno=this.giorno;
    switch (this.motivoAssenza.value) {
      case "ferie":
        this.modelloDatiGiornaliero.ferie=true;
        this.modelloDatiGiornaliero.lavorato=false;
        this.modelloDatiGiornaliero.malattia=false;
        this.modelloDatiGiornaliero.permesso=false;
        this.modelloDatiGiornaliero.oreLavorate='0';
        this.modelloDatiGiornaliero.oreROL='0';
        this.modelloDatiGiornaliero.orePermessi='0';
        this.modelloDatiGiornaliero.oreStraordinario= '0';

        break;
      case "malattia":
        this.modelloDatiGiornaliero.ferie=false;
        this.modelloDatiGiornaliero.lavorato=false;
        this.modelloDatiGiornaliero.malattia=true;
        this.modelloDatiGiornaliero.permesso=false;
        this.modelloDatiGiornaliero.oreLavorate='0';
        this.modelloDatiGiornaliero.oreROL='0';
        this.modelloDatiGiornaliero.orePermessi='0';
        this.modelloDatiGiornaliero.oreStraordinario= '0';
        
        break;
      case "R.O.L.":
        this.modelloDatiGiornaliero.ferie=false;
        this.modelloDatiGiornaliero.lavorato=true;
        this.modelloDatiGiornaliero.malattia=false;
        this.modelloDatiGiornaliero.permesso=false;
        this.modelloDatiGiornaliero.oreLavorate= this.oreLavoroFormattate;
        this.modelloDatiGiornaliero.oreROL=this.oreNonLavorate; 
        this.modelloDatiGiornaliero.orePermessi='0';
        this.modelloDatiGiornaliero.oreStraordinario= '0';
        
        break;
      case "permessi":
        this.modelloDatiGiornaliero.ferie=false;
        this.modelloDatiGiornaliero.lavorato=true;
        this.modelloDatiGiornaliero.malattia=false;
        this.modelloDatiGiornaliero.permesso=true;
        this.modelloDatiGiornaliero.oreLavorate= this.oreLavoroFormattate;
        this.modelloDatiGiornaliero.orePermessi=this.oreNonLavorate; 
        this.modelloDatiGiornaliero.oreROL='0';
        this.modelloDatiGiornaliero.oreStraordinario= '0';
        
        break;
    
      default:
          this.modelloDatiGiornaliero.ferie=false;
          //this.modelloDatiGiornaliero.lavorato=true;
          this.modelloDatiGiornaliero.malattia=false;
          this.modelloDatiGiornaliero.permesso=false;
          this.modelloDatiGiornaliero.oreLavorate= this.oreLavoroFormattate;
          this.modelloDatiGiornaliero.oreStraordinario= this.oreStraordinario;
          this.modelloDatiGiornaliero.oreROL='0';
          this.modelloDatiGiornaliero.orePermessi='0';
        break;
    }
    this.totOre + this.oreRigaSecondarie >0 ? this.modelloDatiGiornaliero.lavorato=true:null;
    // console.log("valore 1 : '"+ this.inizioReperibilita.value + "'", "valore 2 '" +  this.fineReperibilita.value + "'");
    this.modelloDatiGiornaliero.oreIntervento=this.oreInterventoFormattate;
    (this.inizioReperibilita.value!=='' &&  this.fineReperibilita.value!=='') ? this.modelloDatiGiornaliero.reperibilita=true : this.modelloDatiGiornaliero.reperibilita=false;
  }

  caricamento(){
    //console.log('inizio delle ricerche per il giorno ',this.giorno, this.mese,this.anno )
    const json: modelloJson=this.servizioDiInvio.caricaFileJson(this.giorno,this.mese,this.anno);
    //console.log('dati ricevuti',json);
    if(isNull(json) || isUndefined(json))
      return;
    const righeSecondarie= this.orarioLavoroForm.get('righeSecondarie');
    const orariMattina= this.orarioLavoroForm.get('orari').get('orariMattina');
    const orariPomeriggio= this.orarioLavoroForm.get('orari').get('orariPomeriggio');
    let i=0;
    
    json.progetti.forEach(element => {
      if(this.orarioLavoroForm.get('clientiEProgetti').value == ''){
        this.orarioLavoroForm.get('clientiEProgetti').setValue(element.nomeProgetto);
        orariMattina.get('inizioMattina').setValue(element.inizioMattina);
        orariMattina.get('fineMattina').setValue(element.fineMattina);
        orariPomeriggio.get('inizioPomeriggio').setValue(element.inizioPomeriggio);
        orariPomeriggio.get('finePomeriggio').setValue(element.finePomeriggio);
        orariPomeriggio.get('giornoSuccessivo').setValue(element.giornoSuccessivo);
        this.calcolaOrario(element.inizioMattina,element.fineMattina,element.inizioPomeriggio,element.finePomeriggio,<boolean>element.giornoSuccessivo);
      }else{
        this.nuovaRiga();
        righeSecondarie.get(i.toString()).get('clientiEProgettiSecondario').setValue(element.nomeProgetto);
        righeSecondarie.get(i.toString()).get('orariMattinaSecondari').get('inizioMattinaSecondario').setValue(element.inizioMattina);
        righeSecondarie.get(i.toString()).get('orariMattinaSecondari').get('fineMattinaSecondario').setValue(element.fineMattina);
        righeSecondarie.get(i.toString()).get('orariPomeriggioSecondari').get('inizioPomeriggioSecondario').setValue(element.inizioPomeriggio);
        righeSecondarie.get(i.toString()).get('orariPomeriggioSecondari').get('finePomeriggioSecondario').setValue(element.finePomeriggio);
        righeSecondarie.get(i.toString()).get('orariPomeriggioSecondari').get('giornoSuccessivoSecondario').setValue(element.giornoSuccessivo);
        this.calcolaOrarioSecondario(element.inizioMattina,element.fineMattina,element.inizioPomeriggio,element.finePomeriggio,<boolean>element.giornoSuccessivo);
        i++;
      }
    });

    this.orarioLavoroForm.get('motivoAssenza').setValue(json.motivazioneAssenza);
    const reperibilita=this.orarioLavoroForm.get('reperibilita');

     const interventiSecondari = this.orarioLavoroForm.get('interventiSecondari') as FormArray;
     let index=0;
    json.reperibilita.forEach(element => {
       if(element.tipo=='Reperibilita' || element.tipo===''){
        reperibilita.get('inizioReperibilita').setValue(element.inizio);
        reperibilita.get('fineReperibilita').setValue(element.fine);
       }
       else{
         //console.log('caricamento');
        interventiSecondari.push(this.interventoSecondario());
        interventiSecondari.get(index.toString()).get('inizioReperibilitaSecondario').setValue(element.inizio);
        interventiSecondari.get(index.toString()).get('fineReperibilitaSecondario').setValue(element.fine);
        index++;
       }
    });
    this.calcolaOreIntervento();
    this.segnaIDatiGiornalieri();
    this.invioDatiMensili.emit(this.modelloDatiGiornaliero);
    this.orarioLavoroForm.markAsDirty();
    this.orarioLavoroForm.disable();
    this.inviato=true;
  }

  ngOnInit() {
    this.meseCambiato=this.mese;
    this.annoCambiato= this.anno;
    //eliminare i prossimi 3 vettori
    this.clienti=['1','2','3'];
    this.tipiAssenze=['permessi','ferie',  'malattia', 'R.O.L.'];
    this.opzioniReperibilita=['Reperibilita', 'Intervento'];
    this.orarioLavoroForm=this.fb.group({
      orari: this.fb.group({
        orariMattina: this.fb.group({
        inizioMattina :[''],
        fineMattina : ['']
        }, {validator: OrarioMattinaValidator}),
        orariPomeriggio: this.fb.group({
        inizioPomeriggio : [''],
        finePomeriggio : [''],
        giornoSuccessivo: [false],
        },{validator: OrarioPomeriggioValidator}),
      }),
      motivoAssenza: [''],
      reperibilita: this.fb.group({
        inizioReperibilita: [''],
        fineReperibilita:['']
      }),
      clientiEProgetti:['', Validators.required],
      righeSecondarie: <FormArray>this.fb.array([]),
      interventiSecondari: this.fb.array([])
    }, {validator: AssenzaGLValidator});
    this.caricamento();
    // this.righeSecondarie.clear();
    //console.log(this.giornoSuccessivo);
  }
  
  autocompila(){
    let scelta;
    if(this.orarioLavoroForm.dirty)
      scelta=window.confirm("sei sicuro? i valori diventeranno gli orari lavorativi standard, ogni aggiunta verrà persa");
    else
      scelta=true;

    if(!scelta)
      return;
    this.totOre=0;
    this.oreRigaSecondarie=0;
    this.righeSecondarie.clear();
    this.interventiSecondari.clear();
    this.inizioMattina.setValue('09:00');
    this.fineMattina.setValue('13:00');
    this.inizioPomeriggio.setValue('14:00');
    this.finePomeriggio.setValue('18:00');
    this.giornoSuccessivo.setValue(false);
    this.inizioReperibilita.setValue('');
    this.fineReperibilita.setValue('');
    this.calcolaOrario('09:00', '13:00', '14:00', '18:00', false);
  }

  nuovaRiga(){
    // console.log(this.righeSecondarie);
    this.righeSecondarie.push(this.generaRigaSecondaria());
  }

  generaRigaSecondaria(): FormGroup{
    return this.fb.group({
    orariMattinaSecondari: this.fb.group(
      {
      inizioMattinaSecondario :[''],
      fineMattinaSecondario : ['']
      },{validator: OrarioMattinaSecondarioValidator}),


    orariPomeriggioSecondari: this.fb.group({
    inizioPomeriggioSecondario : [''],
    finePomeriggioSecondario : [''],
    giornoSuccessivoSecondario: [''],
    }, {validator: OrarioPomeriggioSecondarioValidator}),


    clientiEProgettiSecondario:[''],
  });
  // return this.fb.group({
  //   cliente: new FormControl('')
  // })
  }

  segnalaIntervento(){
    this.interventiSecondari.push(this.interventoSecondario());
  }

  interventoSecondario():FormGroup{
    return this.fb.group({
    inizioReperibilitaSecondario: [''],
    fineReperibilitaSecondario:['']
    })
  }

  eliminaInterventoSecondario(i:number){
    const inizioReperibilitaSecondario=this.creaData( this.interventiSecondari.get(i.toString()).get('inizioReperibilitaSecondario').value);
    const fineReperibilitaSecondario=this.creaData( this.interventiSecondari.get(i.toString()).get('fineReperibilitaSecondario').value);
    this.oreIntervento-= ((fineReperibilitaSecondario - inizioReperibilitaSecondario)/(60*60*1000));
    this.calcolaOreInterventoFormattate();
    this.interventiSecondari.removeAt(i);
  }

  get interventiSecondari(){
    return this.orarioLavoroForm.get('interventiSecondari') as FormArray;
  }

  get righeSecondarie(){
    return this.orarioLavoroForm.get('righeSecondarie')  as FormArray;
  }

  get fineReperibilita(){
    return this.orarioLavoroForm.get('reperibilita').get('fineReperibilita');
  }

  get inizioReperibilita(){
    return this.orarioLavoroForm.get('reperibilita').get('inizioReperibilita');
  }

  get clientiEProgetti(){
    return this.orarioLavoroForm.get('clientiEProgetti');
  }

  get giornoSuccessivo(){
    return this.orarioLavoroForm.get('orari').get('orariPomeriggio').get('giornoSuccessivo');
  }

  get motivoAssenza(){
    return this.orarioLavoroForm.get('motivoAssenza');
  }

  get orari(){
    return this.orarioLavoroForm.get('orari');
  }

  get orariMattina(){
    return this.orarioLavoroForm.get('orari').get('orariMattina');
  }

  get orariPomeriggio(){
    return this.orarioLavoroForm.get('orari').get('orariPomeriggio');
  }

  get inizioMattina(){
    return this.orarioLavoroForm.get('orari').get('orariMattina').get('inizioMattina');
  }

  get fineMattina(){
    return this.orarioLavoroForm.get('orari').get('orariMattina').get('fineMattina');
  }

  get inizioPomeriggio(){
    return this.orarioLavoroForm.get('orari').get('orariPomeriggio').get('inizioPomeriggio');
  }

  get finePomeriggio(){
    return this.orarioLavoroForm.get('orari').get('orariPomeriggio').get('finePomeriggio');
  }

  private creaData(value:string, giornoSucc:boolean=false){
    if(giornoSucc) 
     return Date.UTC(CalendarService.getFullYear(), CalendarService.getMonth(),  CalendarService.getDay()+1, Number.parseInt(value.substr(0,2)), Number.parseInt(value.substr(3,4)));
    return Date.UTC(CalendarService.getFullYear(), CalendarService.getMonth(),  CalendarService.getDay(), Number.parseInt(value.substr(0,2)), Number.parseInt(value.substr(3,4)));
  }

  calcolaOrario(valueIM:string, valueFM:string, valueIP:string, valueFP:string, giornoSucc:boolean){
    this.totOre=0;
    const temp:boolean= this.giornoSuccessivo.value;
    //console.log('triggered in giorno', this.giorno)
    //console.log( 'giorno ' + this.giorno, valueIM, valueFM, valueIP, valueFP, temp, giornoSucc);
    
    let im= this.creaData(valueIM);
    let fm= this.creaData(valueFM);
    let ip= this.creaData(valueIP);
    let fp= this.creaData(valueFP, temp);
    
    !(isNaN(im) || isNaN(fm))? this.totOre+= fm-im : this.totOre+=0 ;
    !(isNaN(ip) || isNaN(fp))? this.totOre+= fp-ip : this.totOre+=0 ;
    this.totOre/=(60*60*1000);
    this.totOre=Number.parseFloat(this.totOre.toFixed(2));
    this.totOre<0? this.totOre=0 : null;
   // console.log('totOre', this.totOre, 'fm-im', fm-im, 'fp-ip', fp-ip, 'this.totOre/=(60*60*1000)',this.totOre/=(60*60*1000));
    this.mostraOre();
    //console.log(this.totOre, ' in questo giorno: ', this.giorno);
  }

  calcolaOrarioSecondario(valueIM:string, valueFM:string, valueIP:string, valueFP:string, giornoSucc:boolean=false){
    //console.log( 'giorno Secondario ' + this.giorno, valueIM, valueFM, valueIP, valueFP, giornoSucc);
     this.oreRigaSecondarie=0;
    let im= this.creaData(valueIM);
    let fm= this.creaData(valueFM);
    let ip= this.creaData(valueIP);
    let fp= this.creaData(valueFP, giornoSucc);
    
    !(isNaN(im) || isNaN(fm))? this.oreRigaSecondarie+= fm-im : this.oreRigaSecondarie+=0 ;
    !(isNaN(ip) || isNaN(fp))? this.oreRigaSecondarie+= fp-ip : this.oreRigaSecondarie+=0 ;
    this.oreRigaSecondarie/=(60*60*1000);
    this.oreRigaSecondarie=Number.parseFloat(this.oreRigaSecondarie.toFixed(2));
    this.mostraOre();
  }

  eliminaRiga(index){
    //console.log('eliminata riga secondaria con indice '+ index);
    this.righeSecondarie.removeAt(index);
  }

  calcolaOreIntervento(){
    this.oreIntervento=0;
    for (let index = 0; index < this.interventiSecondari.length; index++) {
      const ir= this.creaData( this.interventiSecondari.get(index.toString()).get('inizioReperibilitaSecondario').value);
     const fr= this.creaData( this.interventiSecondari.get(index.toString()).get('fineReperibilitaSecondario').value);
     let temp=0;
     !(isNaN(ir) || isNaN(fr))? temp += fr-ir : temp +=0 ;
     temp/=(60*60*1000);
     this.oreIntervento+=Number.parseFloat(temp.toFixed(2));
    }
   this.calcolaOreInterventoFormattate();
  }


  calcolaOreInterventoFormattate(){
    const minutiDaConveritre= this.oreIntervento- Math.trunc(this.oreIntervento);
    let minuti= (minutiDaConveritre * 60).toFixed(0);
    isNaN(this.oreIntervento)? this.oreIntervento=0 : null;
    minuti === 'NaN'? minuti='0' : null;
    this.oreInterventoFormattate= (minuti==='00' || minuti==='0') ? this.oreIntervento.toString() : Math.trunc(this.oreIntervento)+ ':' +(Number.parseInt(minuti) <=9? '0'+minuti : minuti );
    // console.log('ore lavoro formattate',this.oreInterventoFormattate);
  }

 mostraOre(){
  const oreDecimali= this.totOre+this.oreRigaSecondarie
  // console.log( oreDecimali + ' = '+ this.totOre + '+' + this.oreRigaSecondarie);
  const minutiDaConveritre= oreDecimali- Math.trunc(oreDecimali);
  // console.log( minutiDaConveritre + ' = '+ oreDecimali + '-' + Math.trunc(oreDecimali));
  // console.log( oreDecimali + ' orario:' +  Math.trunc(oreDecimali) + " : " +(minutiDaConveritre * 60).toFixed(0));
  const minuti= (minutiDaConveritre * 60).toFixed(0);
  this.oreNonLavorate=Number.parseInt(minuti)<=0 ? (8-Math.trunc(oreDecimali)).toString() : 8-Math.trunc(oreDecimali) + ":"+ (60- Number.parseInt(minuti));
  if (8-Math.trunc(oreDecimali) <0 || (8-Math.trunc(oreDecimali) == 0 && minuti!=='0' ) ) {
    this.oreStraordinario= minuti==='0'? (Math.trunc(oreDecimali)-8).toString() : (Math.trunc(oreDecimali)-8)+ ":"+ (minuti.length<2 ? '0'+minuti : minuti);
  }
  this.oreLavoroFormattate=minuti==='00' ||  minuti==='0' ?  oreDecimali.toString() : Math.trunc(oreDecimali) + ":" + (Number.parseInt(minuti) <=9? '0'+minuti : minuti );
 }

 invio(orarioLavoroForm){
  //  console.log(orarioLavoroForm);
  this.modelloSalvataggio.motivazioneAssenza=orarioLavoroForm.get('motivoAssenza').value;
  // console.log(this.modelloSalvataggio.motivazioneAssenza);
  this.modelloSalvataggio.dataRiga= new Date(Date.UTC(CalendarService.getFullYear(), CalendarService.getMonth(),  this.giorno));
  // console.log(this.modelloSalvataggio.dataRiga);
  this.modelloSalvataggio.oreDiLavoro= this.oreLavoroFormattate;
  // console.log(this.modelloSalvataggio.oreDiLavoro);
  const orarioMattina= orarioLavoroForm.get('orari').get('orariMattina');
  const orarioPomeriggio : FormGroup= orarioLavoroForm.get('orari').get('orariPomeriggio');
  const progetto = new ProgettoModel(orarioLavoroForm.get('clientiEProgetti').value, orarioMattina.get('inizioMattina').value, orarioMattina.get('fineMattina').value, orarioPomeriggio.get('inizioPomeriggio').value, orarioPomeriggio.get('finePomeriggio').value, orarioPomeriggio.get('giornoSuccessivo').value);
  // console.log(progetto);
  this.modelloSalvataggio.progetti.push(progetto);
  const reperibilita= orarioLavoroForm.get('reperibilita');
  const rep= new ReperibilitaModel('Reperibilita', reperibilita.get('inizioReperibilita').value , reperibilita.get('fineReperibilita').value );
  this.modelloSalvataggio.reperibilita.push(rep);

  for (let index = 0; index < this.righeSecondarie.length; index++) {
    const clientiEProgettiSecondario=this.righeSecondarie.get(index.toString()).get('clientiEProgettiSecondario');
    const orariMattinaSecondari= this.righeSecondarie.get(index.toString()).get('orariMattinaSecondari');
    const orariPomeriggioSecondari= this.righeSecondarie.get(index.toString()).get('orariPomeriggioSecondari');
    const inizioMattinaSecondario= orariMattinaSecondari.get('inizioMattinaSecondario');
    const fineMattinaSecondario= orariMattinaSecondari.get('fineMattinaSecondario');
    const inizioPomeriggioSecondario= orariPomeriggioSecondari.get('inizioPomeriggioSecondario');
    const finePomeriggioSecondario= orariPomeriggioSecondari.get('finePomeriggioSecondario');
    const giornoSuccessivoSecondario= orariPomeriggioSecondari.get('giornoSuccessivoSecondario');
    // console.log(this.righeSecondarie.get(index.toString()).get('orariPomeriggioSecondari').value );
    this.modelloSalvataggio.progetti.push(new ProgettoModel(
      clientiEProgettiSecondario.value,inizioMattinaSecondario.value,fineMattinaSecondario.value,inizioPomeriggioSecondario.value,finePomeriggioSecondario.value,giornoSuccessivoSecondario.value
    ));    
  }
  for (let index = 0; index < this.interventiSecondari.length; index++) {
    const rep=this.interventiSecondari.get(index.toString());
    this.modelloSalvataggio.reperibilita.push(
      new ReperibilitaModel('Intervento',  rep.get('inizioReperibilitaSecondario').value,  rep.get('fineReperibilitaSecondario').value)
    );
  }

  this.servizioDiInvio.enroll(this.modelloSalvataggio)
  .subscribe(data => console.log('Invio modello salvataggio Riuscito', data),
  error => console.log('Errore: ', error));

  this.invioDatiMensili.emit(this.modelloDatiGiornaliero);
  this.inviato=true;
 }

}
