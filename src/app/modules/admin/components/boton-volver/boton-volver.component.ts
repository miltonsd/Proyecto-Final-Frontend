import { Component, Input } from '@angular/core'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'pa-boton-volver',
  templateUrl: './boton-volver.component.html',
  styleUrls: ['./boton-volver.component.css']
})
export class BotonVolverComponent {
  faArrowLeft = faArrowLeft
  @Input() titulo!: string
}
