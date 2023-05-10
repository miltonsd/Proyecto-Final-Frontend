import { Component } from '@angular/core';

@Component({
  selector: 'pa-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent {
  horas = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'];
  personas = [2,4,6,8,10,12,14,16];
  mesas =  [];
  minDate: Date;
  maxDate: Date;

  constructor() {
    // Habilita para hacer reservas desde el mismo dia hasta el utlimo dia del mes siguiente
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate(); 
    this.minDate = new Date(currentYear, currentMonth, currentDate);
    this.maxDate = new Date(currentYear, currentMonth+1, 31);
  }
}
