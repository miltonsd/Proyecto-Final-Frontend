import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ReservasService } from '@pa/reservas/services';
import { MesasService } from '@pa/mesas/services';

moment.locale("es");

@Component({
  selector: 'pa-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  horas = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'];
  personas = [2,4,6,8,10,12,14,16];
  mesas: any[] = [];
  minDate: Date;
  maxDate: Date;
  displayedColumns: string[] = ['fechaHora', 'cant_personas', 'id_mesa'];
  mostrarReservas: Boolean = false;
  respuesta: any;
  reservasDatos: any[] = [];
  formulario = new FormGroup ({ 
    fecha: new FormControl('', {validators: [Validators.required]}),
    hora: new FormControl('', {validators: [Validators.required]}),
    cantidad: new FormControl('', {validators: [Validators.required]}),
    mesa: new FormControl('', {validators: [Validators.required]}),
  });


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
      },
      error: (err) => {
        console.error(`Código de error ${err.status}: `, err.error.msg);
      },
    });
  }

  onVerReservas() {
    if (this.mostrarReservas) {
      this.mostrarReservas = false;
    } else {
      this.mostrarReservas = true;
    }
  }

  onSubmit() {
    if(this.formulario.valid) {
      const fecha = moment(this.formulario.value.fecha).format('yyyy-MM-DD');
      const fechaHora = fecha + ' ' + this.formulario.value.hora;
      console.log(fechaHora); 
      const reserva = {fechaHora: fechaHora, cant_personas: this.formulario.value.cantidad,
      estado: 'Pendiente', id_usuario: 1, id_mesa: this.formulario.value.mesa};
      this._reservasService.createReserva(reserva).subscribe({
        next: (respuesta:any) => {alert(respuesta.msg);
        window.location.href = '/';
      }, 
      error: (err) => {alert(err.msg)}
      });
    }
    else {
      this.formulario.markAllAsTouched()
    }
  }
  
}
