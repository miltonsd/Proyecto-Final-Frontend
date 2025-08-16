import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import * as moment from 'moment'
import 'moment/locale/es'

import { MesaReserva } from '@pa/shared/interfaces/mesa/mesa-reserva.interface'
import { ReservaPendiente } from '@pa/shared/interfaces/reserva/reserva-pendiente.interface'
import { ReservaUpdate } from '@pa/shared/interfaces/reserva/reserva-update.interface'

@Component({
  selector: 'pa-dialog-editar-reserva',
  templateUrl: './dialog-editar-reserva.component.html',
  styleUrls: ['./dialog-editar-reserva.component.css']
})
export class DialogEditarReservaComponent implements OnInit {
  fechaHora = ''
  cantidad = 1
  horas = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
  mesas: MesaReserva[] = []
  reservas: ReservaPendiente[] = []
  minDate: Date
  maxDate: Date
  mesaSeleccionada!: MesaReserva | undefined

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      listaReservas: ReservaPendiente[]
      mesas: MesaReserva[]
      reserva: ReservaPendiente
    },
    public dialogRef: MatDialogRef<DialogEditarReservaComponent>
  ) {
    // Habilita para hacer reservas desde el mismo dia hasta el utlimo dia del mes siguiente
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentDate = new Date().getDate()
    this.minDate = new Date(currentYear, currentMonth, currentDate)
    this.maxDate = new Date(currentYear, currentMonth + 2, 0)
  }

  formulario = new FormGroup({
    fechaHora: new FormGroup({
      fecha: new FormControl('', { validators: [Validators.required] }),
      hora: new FormControl('', { validators: [Validators.required] })
    }),
    mesa: new FormControl(0, {
      validators: [Validators.required, Validators.min(1)] // Valida que el id recibido no sea 0
    })
  })

  ngOnInit(): void {
    // Asigna los datos que vienen del componente padre por medio de 'data'
    this.mesas = this.data.mesas
    this.reservas = this.data.listaReservas // Busca las reservas pendientes del usuario
    this.cantidad = this.data.reserva.cant_personas
    this.fechaHora = this.data.reserva.fechaHora
    // Busca las mesas para el formulario
    this._establecerFechaHora()
    this.cargarFormulario()
  }

  private _establecerFechaHora() {
    // Inicializa fechaHora para que el componente hijo tenga los datos correctos
    this.fechaHora = this.data.reserva.fechaHora

    // Se suscribe a los cambios para actualizar fechaHora
    this.formulario.get('fechaHora')?.valueChanges.subscribe({
      next: (valor) => {
        if (valor.fecha && valor.hora) {
          const fecha = moment(valor.fecha).format('DD/MM/yyyy')
          this.fechaHora = `${fecha} ${valor.hora}`
        }
      }
    })
  }

  cargarFormulario() {
    const reservaFecha = this.fechaHora.slice(0, 10) as string
    const reservaHora = this.fechaHora.slice(11) as string

    this.formulario.patchValue({
      fechaHora: {
        fecha: moment(reservaFecha, 'DD/MM/yyyy', false).format(), // Forgiving mode (los formatos de fechas son distintos)
        hora: reservaHora
      },
      mesa: this.data.reserva.id_mesa
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSelectMesa(eventData: { id: number }) {
    // Asigna el id de la mesa al control del formulario
    // Sirve para actualizar los valores de los controles del formulario
    this.formulario.patchValue({
      mesa: eventData.id
    })
  }

  onSubmit() {
    if (this.formulario.valid) {
      const fecha = moment(this.formulario.value.fechaHora?.fecha).format(
        'yyyy-MM-DD'
      )
      const fechaHora = fecha + ' ' + this.formulario.value.fechaHora?.hora
      const reservaEditada: ReservaUpdate = {
        id_reserva: this.data.reserva.id_reserva,
        fechaHora: fechaHora,
        cant_personas: this.cantidad,
        isPendiente: true,
        id_usuario: this.data.reserva.id_usuario,
        id_mesa: this.formulario.value.mesa as number
      }
      this.dialogRef.close({ reservaEditada: reservaEditada })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
}
