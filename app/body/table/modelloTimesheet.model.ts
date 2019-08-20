import { datiGiornalieriModel } from './riga/datiGiornalieri.model';
import { datiDelMeseModel } from './datiDelMese.model';
import { CalendarService } from 'src/app/calendar.service';

export class TimeSheet{
    nome:string;
    registroGiornaliero: datiGiornalieriModel[] = new Array(CalendarService.getLastDayOfCurrentMonth());
    riepilogoMensile: datiDelMeseModel;

}