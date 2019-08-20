export class ProgettoModel{
    constructor(
        public nomeProgetto:string,
        public inizioMattina:string, public fineMattina:string,
        public inizioPomeriggio:string,  public finePomeriggio:string,
        public giornoSuccessivo:boolean  
    ){}
}