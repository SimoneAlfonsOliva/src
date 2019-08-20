import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { modelloJson } from './modelloJSON.model';

@Injectable({
  providedIn: 'root'
})
export class InvioService {
  _url="http://localhost:3000/enroll";
  constructor(private _http: HttpClient) { }

  enroll( model){
    return this._http.post<any>(this._url,model)
    .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse){
    return throwError(error);
  }

  private  get fileJSON():modelloJson{
    return { nomeCompleto: "Simone Alfonso Oliva",
    dataRiga:"2019-07-01T00:00:00.000Z",
    progetti:
     [ { nomeProgetto: "1",
        inizioMattina: "09:00",
        fineMattina: "13:00",
        inizioPomeriggio: "14:00",
        finePomeriggio: "18:00",
        giornoSuccessivo: false
      } ],
    oreDiLavoro: "8",
    motivazioneAssenza: "",
    reperibilita: [{ tipo: "", inizio: "", fine: "" }]
    }
  }

  private get fileJSON2():modelloJson{
    return { nomeCompleto: "Simone Alfonso Oliva",
    dataRiga:"2019-07-02T00:00:00.000Z",
    progetti:
     [ { nomeProgetto: "2",
        inizioMattina: "09:00",
        fineMattina: "13:00",
        inizioPomeriggio: "",
        finePomeriggio: "",
        giornoSuccessivo: false
      } ],
    oreDiLavoro: "4",
    motivazioneAssenza: "permessi",
    reperibilita: [{ "tipo": "Reperibilita", "inizio": "14:00", "fine": "18:00" }] 
}
  }

  private get fileJSON3():modelloJson{
    return { nomeCompleto: "Simone Alfonso Oliva",
    dataRiga:"2019-07-03T00:00:00.000Z",
    progetti:
     [ { nomeProgetto: "2",
        inizioMattina: "09:00",
        fineMattina: "13:00",
        inizioPomeriggio: "",
        finePomeriggio: "",
        giornoSuccessivo: false
      } ],
    oreDiLavoro: "4",
    motivazioneAssenza: "permessi",
    reperibilita:
     [ { tipo: 'Reperibilita', inizio: '09:00', fine: '13:00' },
       { tipo: 'Intervento', inizio: '14:00', fine: '16:00' },
       { tipo: 'Intervento', inizio: '15:00', fine: '16:00' } ] } 
  }
  
  private get fileJSON4():modelloJson{
    return { nomeCompleto: '',
    dataRiga: '2019-07-04T00:00:00.000Z',
    progetti:
     [ { nomeProgetto: '3',
         inizioMattina: '09:00',
         fineMattina: '13:00',
         inizioPomeriggio: '',
         finePomeriggio: '',
         giornoSuccessivo: false },
       { nomeProgetto: '2',
         inizioMattina: '',
         fineMattina: '',
         inizioPomeriggio: '14:00',
         finePomeriggio: '16:00',
         giornoSuccessivo: false },
       { nomeProgetto: '1',
         inizioMattina: '',
         fineMattina: '',
         inizioPomeriggio: '23:00',
         finePomeriggio: '03:00',
         giornoSuccessivo: true } ],
    oreDiLavoro: '8',
    motivazioneAssenza: '',
    reperibilita: [ { tipo: '', inizio: '', fine: '' } ] }
  }
  private get fileJSON5(){
    return { nomeCompleto: '',
    dataRiga: '2019-08-01T00:00:00.000Z',
    progetti:
     [ { nomeProgetto: '1',
         inizioMattina: '09:00',
         fineMattina: '13:00',
         inizioPomeriggio: '14:00',
         finePomeriggio: '18:00',
         giornoSuccessivo: false } ],
    oreDiLavoro: '8',
    motivazioneAssenza: '',
    reperibilita: [ { tipo: 'Reperibilita', inizio: '', fine: '' } ] }
  }

  caricaFileJson(giorno:number, mese:number, anno:number):modelloJson | null{
    let files:modelloJson[] = new Array();
    files.push(this.fileJSON);
    files.push(this.fileJSON2);
    files.push(this.fileJSON3);
    files.push(this.fileJSON4);
    files.push(this.fileJSON5);
    //console.log('ricerca dati salvati per la data ' + giorno + ' '+ mese + ' '+ ' '+ anno);
    for (let index = 0; index < files.length; index++) {
      if(Number.parseInt(files[index].dataRiga.substr(0,4)) === anno && Number.parseInt(files[index].dataRiga.substr(5,6))-1=== mese && Number.parseInt(files[index].dataRiga.substr(8,9))=== giorno){
        //console.log('trovata corrispondenza per ' + giorno + ' '+ mese + ' '+ ' '+ anno, files[index]);
        return files[index];
      }
      
    }
    return null;
  }

}