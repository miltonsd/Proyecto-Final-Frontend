import { Component, OnInit, Output } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { ReservasService } from '@pa/reservas/services'
import { MesasService } from '@pa/mesas/services'
import { IMesa, TableColumn } from '@pa/shared/models'
import { ReservaData, ReservaPOST, ReservaTabla } from '@pa/reservas/models'
import { map } from 'rxjs'
import { DialogComponent } from '@pa/shared/components'
import { MatDialog } from '@angular/material/dialog'
import { DialogEditarReservaComponent } from './components/dialog-editar-reserva/dialog-editar-reserva.component'

moment.locale('es')

@Component({
  selector: 'pa-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  @Output() fechaHora = ''
  @Output() cantidad = 1
  // @Output() fechaHora!: string
  // @Output() cantidad!: number
  horas = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
  mesas: IMesa[] = []
  minDate: Date
  maxDate: Date
  mostrarReservas = false
  respuesta: any
  reservas: ReservaTabla[] = []

  // Formulario de reservas
  formulario = new FormGroup({
    fechaHoraCantidad: new FormGroup({
      fecha: new FormControl('', { validators: [Validators.required] }),
      hora: new FormControl('', { validators: [Validators.required] }),
      cantidad: new FormControl(1, {
        validators: [Validators.required, Validators.min(1), Validators.max(6)]
      })
    }),
    mesa: new FormControl(0, {
      validators: [Validators.required, Validators.min(1)] // Valida que el id recibido no sea 0
    })
  })

  // Defino las columnas de la tabla de reservas
  columnas: TableColumn[] = [
    { name: 'Fecha y hora', dataKey: 'fechaHora' },
    {
      name: 'Cantidad de personas',
      dataKey: 'cant_personas',
      isSortable: true
    },
    { name: 'Mesa', dataKey: 'id_mesa' },
    {
      name: ' ',
      dataKey: 'actionButtons',
      editButton: true,
      deleteButton: true
    }
  ]

  msgConfirmacion = {
    title: 'Confirmar cancelación de la reserva',
    msg: '¿Estás seguro de cancelar esta reserva? Esta acción no se puede deshacer.'
  }

  constructor(
    private _reservasService: ReservasService,
    private _mesasService: MesasService,
    public dialog: MatDialog
  ) {
    // Habilita para hacer reservas desde el mismo dia hasta el utlimo dia del mes siguiente
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentDate = new Date().getDate()
    this.minDate = new Date(currentYear, currentMonth, currentDate)
    this.maxDate = new Date(currentYear, currentMonth + 2, 0)
  }

  ngOnInit(): void {
    // Busca las reservas
    this.getAllReservas() // Busca las reservas pendientes del usuario
    this.getAllMesas() // Busca las mesas para el formulario
    // Controla si hubo cambios en el input de hora
    this.formulario
      .get('fechaHoraCantidad')
      ?.valueChanges.subscribe((valor) => {
        if (valor.cantidad != 0) {
          this.cantidad = valor.cantidad || 1
          const fecha = moment(valor.fecha).format('DD/MM/yyyy')
          this.fechaHora = fecha + ' ' + valor.hora
          // Filtra las reservas pendientes por la fecha y hora ingresadas
          const reservasFiltradas = this.reservas.filter(
            (r) => r.fechaHora === this.fechaHora
          )
          this.mesas.forEach((mesa) => {
            if (mesa.capacidad < this.cantidad) {
              mesa.habilitada = false
            } else {
              mesa.habilitada = true
            }
          })
          reservasFiltradas.forEach((reserva) => {
            // Si existen reservas para esa fecha y hora, asigna las mesas correpondientes como ocupadas
            const posMesa = reserva.id_mesa - 1
            this.mesas[posMesa].habilitada = false
          })
        }
      })
  }

  getAllReservas() {
    // Se obtiene el listado de reservas pendientes del usuario
    this._reservasService
      .getAllReservas()
      .pipe(
        map((res: any) => {
          this.reservas = Object.keys(res)
            .map((r) => ({
              id_reserva: res[r].id_reserva,
              fechaHora: moment(res[r].fechaHora).format('DD/MM/yyyy HH:mm'),
              cant_personas: res[r].cant_personas,
              isPendiente: res[r].isPendiente,
              id_usuario: res[r].Usuario.id_usuario,
              id_mesa: res[r].Mesa.id_mesa
            }))
            .sort(
              (a, b) =>
                moment(a.fechaHora, 'DD/MM/yyyy HH:mm').unix() -
                moment(b.fechaHora, 'DD/MM/yyyy HH:mm').unix()
            )
            .filter((r) => r.isPendiente)
        })
      )
      .subscribe({
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
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
            habilitada: true
          }))
        })
      )
      .subscribe({
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  onSelectMesa(eventData: { id: number }) {
    // Asigna el id de la mesa al control del formulario
    // Sirve para actualizar los valores de los controles del formulario
    this.formulario.patchValue({
      mesa: eventData.id
    })
  }

  onVerReservas() {
    this.mostrarReservas = !this.mostrarReservas
  }

  onSubmit() {
    console.log(this.formulario.controls)
    if (this.formulario.valid) {
      const reserva: ReservaPOST = {
        fechaHora:
          moment(this.formulario.value.fechaHoraCantidad?.fecha).format(
            'yyyy-MM-DD'
          ) +
          ' ' +
          this.formulario.value.fechaHoraCantidad?.hora,
        cant_personas: this.formulario.value.fechaHoraCantidad
          ?.cantidad as number,
        id_usuario: 1, // Usar el ID del usuario logueado
        id_mesa: this.formulario.value.mesa as number
      }
      this._reservasService.createReserva(reserva).subscribe({
        next: (respuesta: any) => {
          alert(respuesta.msg)
          window.location.href = '/'
        },
        error: (err) => {
          alert(err.msg)
        }
      })
    } else {
      this.formulario.markAllAsTouched()
    }
  }

  onDelete(reserva: any) {
    this._reservasService.deleteReserva(reserva.id_reserva).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Cancelar reserva',
            msg: 'Se ha cancelado la reserva con éxito.'
          }
        })
        dialogRef.afterClosed().subscribe(() => {
          window.location.href = '/reservas'
        })
      },
      error: (err) => {
        this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Error',
            msg: err.error.msg
          }
        })
      }
    })
  }

  onEditReserva(reserva: any) {
    const listaReservas: ReservaData[] = this.reservas
      .map(({ id_reserva, fechaHora, id_mesa }) => ({
        id_reserva,
        fechaHora,
        id_mesa
      }))
      .filter((r) => r.id_reserva != reserva.id_reserva)
    const dialogRef = this.dialog.open(DialogEditarReservaComponent, {
      width: '900px',
      data: {
        reserva,
        listaReservas
      }
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._reservasService
          .updateReserva(reserva.id_reserva, resultado.data)
          .subscribe({
            // next - error - complete
            next: (respuesta: any) => {
              alert(respuesta.msg)
              window.location.href = '/reservas'
            },
            error: (err) => {
              alert(err.msg)
            }
          })
      }
    })
  }
}
