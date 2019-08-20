 export class modelloJson{
    nomeCompleto: string;
    dataRiga: string;
    progetti:{
        nomeProgetto: string;
        inizioMattina: string;
        fineMattina: string;
        inizioPomeriggio: string;
        finePomeriggio: string;
        giornoSuccessivo: boolean;
    }[];
    oreDiLavoro: string;
    motivazioneAssenza: string;
    reperibilita: {
        tipo:string;
        inizio:string;
        fine:string;
    }[];
}