import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'pa-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css']
})
export class CarruselComponent implements OnInit {
  @Input() imagenes: string[] = []
  @Input() indicators = true
  @Input() controls = true
  @Input() autoSlide = false
  @Input() slideInterval = 3000 // 3 segundos por defecto

  selectedIndex = 0
  intervalo!: any

  ngOnInit(): void {
    if (this.autoSlide) {
      this.autoSlideImages()
    }
  }

  autoSlideImages() {
    this.intervalo = setInterval(() => {
      this.onNextClick()
    }, this.slideInterval)
  }

  selectImage(index: number) {
    this.selectedIndex = index
    if (this.autoSlide) {
      clearInterval(this.intervalo) // Detiene el intervalo de tiempo actual
      this.autoSlideImages()
    }
  }

  onPrevClick() {
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.imagenes.length - 1
    } else {
      this.selectedIndex--
    }
    if (this.autoSlide) {
      clearInterval(this.intervalo) // Detiene el intervalo de tiempo actual
      this.autoSlideImages()
    }
  }

  onNextClick() {
    if (this.selectedIndex === this.imagenes.length - 1) {
      this.selectedIndex = 0
    } else {
      this.selectedIndex++
    }
    if (this.autoSlide) {
      clearInterval(this.intervalo) // Detiene el intervalo de tiempo actual
      this.autoSlideImages()
    }
  }
}
