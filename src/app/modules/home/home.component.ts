import { Component } from '@angular/core'
@Component({
  selector: 'pa-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  imagenes: string[] = [
    'HomeQR.jpg',
    'Home1.jpg',
    'Home2.jpg',
    'Home3.jpg',
    'Home4.jpg',
    'Home5.jpg'
  ]
}
