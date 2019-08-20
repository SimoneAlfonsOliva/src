import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService implements OnInit {

  private static Calendario:Date=new Date();

  constructor() { }

  ngOnInit(): void {
  }

  static getNow(){
    return this.Calendario;
  }
  static getDay(){
    return this.Calendario.getDate();
  }
  static getMonth(){
    return this.Calendario.getMonth();
  }
  static getFullYear(){
    return this.Calendario.getFullYear();
  }

  static getLastDayOfCurrentMonth(){
    var oggi = new Date();
    oggi.setMonth(oggi.getMonth()+1); // aggiungo un mese
    oggi.setDate(0);
    return oggi.getDate();
  }
}
