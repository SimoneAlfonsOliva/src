import { ProgettoModel } from './progetto.model';
import { ReperibilitaModel } from './reperibilità.model';

export class RigaInJSONModel{
    constructor(
        public nomeCompleto:string='',
        public dataRiga:Date= new Date(),
        public progetti:ProgettoModel[]=[],
        public oreDiLavoro:string='',
        public motivazioneAssenza:string='',
        public reperibilita:ReperibilitaModel[]=[],
        // public bancaOre:boolean=false //da inviare in base mensile
    ){}
}