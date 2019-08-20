import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-area-admin',
  templateUrl: './area-admin.component.html',
  styleUrls: ['./area-admin.component.css']
})
export class AreaAdminComponent implements OnInit {
dipendenti:string[]=["Simone Oliva", "Mario Cesarano", "Giovanni Bianco", "Federica Kyomi"];
  constructor() {}

  ngOnInit() {
    //console.log(this.dipendenti)
  }

}
