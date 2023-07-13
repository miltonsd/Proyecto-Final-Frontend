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

  ngOnInit(): void {
    if (this.autoSlide) {
      this.autoSlideImages()
    }
  }

  autoSlideImages() {
    setInterval(() => {
      this.onNextClick()
    }, this.slideInterval)
  }

  selectImage(index: number) {
    this.selectedIndex = index
  }

  onPrevClick() {
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.imagenes.length - 1
    } else {
      this.selectedIndex--
    }
  }

  onNextClick() {
    if (this.selectedIndex === this.imagenes.length - 1) {
      this.selectedIndex = 0
    } else {
      this.selectedIndex++
    }
  }
}
