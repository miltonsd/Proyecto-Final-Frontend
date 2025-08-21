import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  Output
} from '@angular/core'
import * as moment from 'moment'
import { MesaReserva } from '@pa/shared/interfaces/mesa/mesa-reserva.interface'
import { ReservaPendiente } from '@pa/shared/interfaces/reserva/reserva-pendiente.interface'

@Component({
  selector: 'pa-mesa-grid',
  templateUrl: './mesa-grid.component.html',
  styleUrls: ['./mesa-grid.component.css']
})
export class MesaGridComponent implements OnChanges {
  @Input() mesas: MesaReserva[] = []
  @Input() fechaHora!: string
  @Input() cantidad!: number
  @Input() reservas: ReservaPendiente[] = []
  @Output() mesaSeleccionadaId = new EventEmitter<{ id: number }>()

  // Array para almacenar el estado de la grilla
  mesasDisponibles: MesaReserva[] = []
  mesaSeleccionada: MesaReserva | undefined

  ngOnChanges(changes: SimpleChanges): void {
    // Detecta si hubo cambios en los @Input() de fechaHora o cantidad
    if (changes['fechaHora'] || changes['cantidad']) {
      this.deseleccionarMesa()
    }
    this._actualizarDisponibilidad()
  }

  private _actualizarDisponibilidad() {
    if (
      !this.mesas ||
      this.mesas.length === 0 ||
      !this.fechaHora ||
      !this.cantidad
    ) {
      this.mesasDisponibles = [...this.mesas] // Mantiene las mesas como están si faltan datos
      return
    }

    // Crea una copia para no modificar el @Input() directamente
    this.mesasDisponibles = this.mesas.map((mesa) => ({
      ...mesa,
      disponible: true
    }))

    // Deshabilita las mesas por capacidad
    this.mesasDisponibles.forEach((mesa) => {
      if (mesa.capacidad < this.cantidad) {
        mesa.disponible = false
      }
    })

    // Estandariza los formatos de fecha para la comparación
    const fechaHoraInput = moment(this.fechaHora, 'DD/MM/yyyy HH:mm')

    // Filtra las reservas pendientes que coincidan con la fecha y hora
    const reservasFiltradas = this.reservas.filter((r) => {
      // Convierte el string del backend a un objeto moment y luego a un formato de string estándar
      const fechaReserva = moment(r.fechaHora)
      return fechaReserva.isSame(fechaHoraInput, 'minute')
    })

    // Deshabilita aquellas mesas que ya estén reservadas
    reservasFiltradas.forEach((reserva) => {
      const mesaOcupada = this.mesasDisponibles.find(
        (m) => m.id_mesa === reserva.id_mesa
      )
      if (mesaOcupada) {
        mesaOcupada.disponible = false
      }
    })
  }

  reservaMesa(mesa: MesaReserva) {
    // Si la mesa está disponible y no es la que está seleccionada
    if (mesa.disponible && this.mesaSeleccionada != mesa) {
      this.mesaSeleccionada = mesa
      // Pasa el id de la mesa al componente Padre (reservas.component.ts)
      this.mesaSeleccionadaId.emit({ id: mesa.id_mesa })
    } else {
      this.deseleccionarMesa()
    }
  }

  deseleccionarMesa() {
    // Deselecciona la mesa y pasa el id = 0
    this.mesaSeleccionada = undefined
    this.mesaSeleccionadaId.emit({ id: 0 })
  }
}
