import { Component, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { forkJoin } from 'rxjs'
import * as moment from 'moment'
import 'moment/locale/es'

import { DialogEditarReservaComponent } from '@pa/reservas/components/dialog-editar-reserva/dialog-editar-reserva.component'
import { DialogComponent } from '@pa/shared/components/dialog/dialog.component'
import { MesaReserva } from '@pa/shared/interfaces/mesa/mesa-reserva.interface'
import { ReservaCreate } from '@pa/shared/interfaces/reserva/reserva-create.interface'
import { ReservaPendiente } from '@pa/shared/interfaces/reserva/reserva-pendiente.interface'
import { TableColumn } from '@pa/shared/interfaces/tabla/table-column.interface'
import { AuthService } from '@pa/shared/services/auth.service'
import { MesaService } from '@pa/shared/services/mesa.service'
import { ReservaService } from '@pa/shared/services/reserva.service'

moment.locale('es')

@Component({
  selector: 'pa-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  @Output() fechaHora = ''
  @Output() cantidad = 1
  horas = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
  mesas: MesaReserva[] = []
  minDate: Date
  maxDate: Date
  mostrarReservas = false
  reservas: ReservaPendiente[] = []
  reservasUsuario: ReservaPendiente[] = []

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
      name: 'Personas',
      dataKey: 'cant_personas'
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
    public dialog: MatDialog,
    private _authService: AuthService,
    private _mesaService: MesaService,
    private _reservaService: ReservaService
  ) {
    // Habilita para hacer reservas desde el mismo dia hasta el utlimo dia del mes siguiente
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentDate = new Date().getDate()
    this.minDate = new Date(currentYear, currentMonth, currentDate)
    this.maxDate = new Date(currentYear, currentMonth + 2, 0)
  }

  ngOnInit(): void {
    this.inicializar()
    // Controla si hubo cambios en el input de hora
    this.formulario
      .get('fechaHoraCantidad')
      ?.valueChanges.subscribe((valor) => {
        // Comprueba que valor y valor.cantidad existen
        if (valor && valor.cantidad && valor.cantidad > 0) {
          this.cantidad = valor.cantidad
          const fecha = moment(valor.fecha).format('DD/MM/yyyy')
          this.fechaHora = fecha + ' ' + valor.hora
        }
      })
  }

  inicializar() {
    // Se crean los observables para las reservas y mesas
    const reservas$ = this._reservaService.getAllReservasPendientes()
    const mesas$ = this._mesaService.getAllMesasReserva()

    // Carga todas las reservas programadas y las mesas en paralelo
    forkJoin([reservas$, mesas$]).subscribe({
      next: ([reservas, mesas]) => {
        this.reservas = reservas
        this.mesas = mesas
        // Se filtran las reservas pendientes del usuario
        this.getAllReservasUsuario()
      },
      error: (err) => {
        this._showDialog(`Error ${err.status}`, err.error.msg)
      }
    })
  }

  getAllReservasUsuario() {
    // Se obtiene el listado de reservas pendientes del usuario
    this.reservasUsuario = this.reservas
      .map((r) => ({
        id_reserva: r.id_reserva,
        fechaHora: moment(r.fechaHora).format('DD/MM/yyyy HH:mm'),
        cant_personas: r.cant_personas,
        id_usuario: r.id_usuario,
        id_mesa: r.id_mesa,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      }))
      .filter((r) => r.id_usuario === this._authService.getCurrentUserId())
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
    if (this.formulario.valid) {
      const nuevaReserva: ReservaCreate = {
        fechaHora:
          moment(this.formulario.value.fechaHoraCantidad?.fecha).format(
            'yyyy-MM-DD'
          ) +
          ' ' +
          this.formulario.value.fechaHoraCantidad?.hora,
        cant_personas: this.formulario.value.fechaHoraCantidad
          ?.cantidad as number,
        isPendiente: true,
        id_usuario: this._authService.getCurrentUserId(), //ID del usuario logueado
        id_mesa: this.formulario.value.mesa as number
      }
      this._reservaService.createReserva(nuevaReserva).subscribe({
        next: (res) => {
          const dialogRef = this._showDialog(
            'Realizar reserva',
            'Reserva registrada correctamente.'
          )
          dialogRef.afterClosed().subscribe(() => {
            // Agrega la nueva reserva al array de reservas del usuario
            const reservaCreada = res.elemento
            reservaCreada.fechaHora = moment(reservaCreada.fechaHora).format(
              'DD/MM/yyyy HH:mm'
            )
            const reservasUpdated = [...this.reservasUsuario, reservaCreada]
            this.reservasUsuario = reservasUpdated.sort((a, b) => {
              const dateA = moment(a.fechaHora, 'DD/MM/yyyy HH:mm').unix()
              const dateB = moment(b.fechaHora, 'DD/MM/yyyy HH:mm').unix()
              return dateA - dateB
            })
            // Muestra la tabla de reservas
            this.mostrarReservas = true
            this.formulario.get('fechaHoraCantidad')?.reset({
              fecha: moment(this.minDate).format('YYYY-MM-DD'),
              hora: '18:00',
              cantidad: 1
            })
            this.formulario.get('mesa')?.setValue(null)
            this.formulario.markAsPristine()
            this.formulario.markAsUntouched()
          })
        },
        error: (err) => {
          // Error 500 cuando no encuentra la tabla 'reservas' o la db, Error 404 cuando no encuentra la reserva por su id
          this._showDialog(`Error ${err.status}`, err.error.msg)
        }
      })
    } else {
      this.formulario.markAllAsTouched()
    }
  }

  onDelete(reserva: ReservaPendiente) {
    this._reservaService.deleteReserva(reserva.id_reserva).subscribe({
      next: () => {
        const dialogRef = this._showDialog(
          'Cancelar reserva',
          'Se ha cancelado la reserva con éxito.'
        )
        dialogRef.afterClosed().subscribe(() => {
          this.reservasUsuario = this.reservasUsuario.filter(
            (r) => r.id_reserva != reserva.id_reserva
          )
        })
      },
      error: (err) => {
        this._showDialog(`Error ${err.status}`, err.error.msg)
      }
    })
  }

  onEditReserva(reserva: ReservaPendiente) {
    const listaReservas = this.reservas.filter(
      (r) => r.id_reserva != reserva.id_reserva
    )
    const dialogRef = this.dialog.open(DialogEditarReservaComponent, {
      width: '600px',
      data: {
        reserva,
        listaReservas,
        mesas: this.mesas
      }
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._reservaService
          .updateReserva(reserva.id_reserva, resultado.reservaEditada)
          .subscribe({
            // next - error - complete
            next: () => {
              const dialogRefEdit = this._showDialog(
                'Editar reserva',
                'Reserva editada correctamente.'
              )
              dialogRefEdit.afterClosed().subscribe(() => {
                // Busca el indice de la reserva que se actualizó
                const index = this.reservasUsuario.findIndex(
                  (r) => r.id_reserva === reserva.id_reserva
                )

                // Si la encuentra, reemplázala con la reserva actualizada
                if (index !== -1) {
                  const reservaActualizada = { ...resultado.reservaEditada }
                  // Formatea la fecha al formato que la tabla espera
                  reservaActualizada.fechaHora = moment(
                    reservaActualizada.fechaHora
                  ).format('DD/MM/yyyy HH:mm')

                  this.reservasUsuario = [
                    ...this.reservasUsuario.slice(0, index), // Elementos antes del que vamos a actualizar
                    reservaActualizada, // El nuevo objeto
                    ...this.reservasUsuario.slice(index + 1) // Elementos después
                  ]
                }
              })
            },
            error: (err) => {
              // Error 500 cuando no encuentra la tabla 'reservas' o la db, Error 404 cuando no encuentra la reserva por su id
              this._showDialog(`Error ${err.status}`, err.error.msg)
            }
          })
      }
    })
  }

  // Muestra un dialog, ya sea por error, o para hacer la lógica luego del afterClosed()
  private _showDialog(
    title: string,
    msg: string
  ): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      width: '375px',
      autoFocus: true,
      data: { title, msg }
    })
  }
}
