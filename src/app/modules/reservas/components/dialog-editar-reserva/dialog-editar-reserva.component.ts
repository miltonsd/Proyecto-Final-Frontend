import { Component, Inject, OnInit, Output } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { map } from 'rxjs'
import { MesasService } from '@pa/mesas/services'
import { ReservaPOST, ReservaTabla } from '@pa/reservas/models'
import { IMesa } from '@pa/shared/models'

@Component({
  selector: 'pa-dialog-editar-reserva',
  templateUrl: './dialog-editar-reserva.component.html',
  styleUrls: ['./dialog-editar-reserva.component.css']
})
export class DialogEditarReservaComponent implements OnInit {
  @Output() fechaHora!: string
  @Output() cantidad!: number
  horas = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
  mesas: IMesa[] = []
  reservaEditada!: ReservaPOST
  reservas: ReservaTabla[] = []
  minDate: Date
  maxDate: Date
  constructor(
    public dialogRef: MatDialogRef<DialogEditarReservaComponent>,
    private _mesasService: MesasService,
    @Inject(MAT_DIALOG_DATA) public data: any
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
    // Busca las reservas
    this.reservas = this.data.listaReservas // Busca las reservas pendientes del usuario
    this.cantidad = this.data.reserva.cant_personas
    this.getAllMesas() // Busca las mesas para el formulario
    // Controla si hubo cambios en el input de hora
    this.formulario.get('fechaHora')?.valueChanges.subscribe((valor) => {
      if (valor.hora != '') {
        const fecha = moment(valor.fecha).format('DD/MM/yyyy')
        this.fechaHora = fecha + ' ' + valor.hora
        // Filtra las reservas pendientes por la fecha y hora ingresadas
        const reservasFiltradas = this.reservas.filter(
          (r) => r.fechaHora === this.fechaHora
        )
        reservasFiltradas.forEach((reserva) => {
          // Si existen reservas para esa fecha y hora, asigna las mesas correpondientes como ocupadas
          const posMesa = reserva.id_mesa - 1
          this.mesas[posMesa].available = false
        })
      }
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
      this.reservaEditada = {
        fechaHora: fechaHora,
        id_mesa: this.formulario.value.mesa as number
      }
      this.dialogRef.close({ data: this.reservaEditada })
    } else {
      this.formulario.markAllAsTouched()
    }
  }

  getAllMesas() {
    //TODO: Aca nos tendriamos que traer las mesas para el horario seleccionado asi se ven las disponibles y no disp.
    this._mesasService
      .getAllMesas()
      .pipe(
        map((res: any) => {
          this.mesas = Object.keys(res).map((m) => ({
            id_mesa: res[m].id_mesa,
            capacidad: res[m].capacidad,
            ubicacion: res[m].ubicacion,
            available: this.cantidad > res[m].capacidad ? false : true
          }))
        })
      )
      .subscribe({
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }
}
