import { Component } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';

import { ReservasService } from '@pa/reservas/services';
import { MesasService } from '@pa/mesas/services';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

moment.locale("es");

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'pa-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent {
  horas = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'];
  personas = [2,4,6,8,10,12,14,16];
  mesas: any[] = [];
  minDate: Date;
  maxDate: Date;
  displayedColumns: string[] = ['fechaHora', 'cant_personas', 'id_mesa'];
  dataSource = ELEMENT_DATA;
  mostrarReservas: Boolean = false;
  respuesta: any;
  reservasDatos: any[] = [];

  constructor(private _reservasService: ReservasService, private _mesasService: MesasService) {
    // Habilita para hacer reservas desde el mismo dia hasta el utlimo dia del mes siguiente
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate(); 
    this.minDate = new Date(currentYear, currentMonth, currentDate);
    this.maxDate = new Date(currentYear, currentMonth+1, 31);
    this._mesasService.getAllMesas().subscribe({
      next: (respuesta: any) => {
        const listaMesas: any[] = [];
        respuesta.forEach((mesa: any) => {
          listaMesas.push({
            id_mesa: mesa.id_mesa,
            capacidad: mesa.capacidad,
            ubicacion: mesa.ubicacion,
            createdAt: mesa.createdAt,
            updatedAt: mesa.updatedAt,
          });
        });
        this.mesas = listaMesas;
      },
      error: (err) => {
        console.error(`Código de error ${err.status}: `, err.error.msg);
      },
    });
  }

  ngOnInit(): void {
    // Buscar los juegos que posee el usuario
    this._reservasService.getAllReservas().subscribe({
      next: (response: any) => {
        this.respuesta = response;
        const listaReservas: any[] = [];
        this.respuesta.forEach((reserva: any) => {
          listaReservas.push({
            id_reserva: reserva.id_reserva,
            // fechaHora: reserva.fechaHora,
            // fechaHora: moment(reserva.fechaHora).format('LLL'),
            fechaHora: moment(reserva.fechaHora).format('DD/MM/yyyy HH:mm'),
            cant_personas: reserva.cant_personas,
            estado: reserva.estado,
            id_usuario: reserva.Usuario.id_usuario,
            id_mesa: reserva.Mesa.id_mesa,
            createdAt: reserva.createdAt,
            updatedAt: reserva.updatedAt,
          });
        });
        this.reservasDatos = listaReservas;
        console.log(this.reservasDatos);
      },
      error: (err) => {
        console.error(`Código de error ${err.status}: `, err.error.msg);
      },
    });
  }

  onVerReservas(): void {
    if (this.mostrarReservas) {
      this.mostrarReservas = false;
    } else {
      this.mostrarReservas = true;
    }
  }

  
}
