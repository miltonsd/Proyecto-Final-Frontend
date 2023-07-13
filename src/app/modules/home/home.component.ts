import { Component, OnInit } from '@angular/core'
import * as fs from 'fs-extra'
@Component({
  selector: 'pa-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imagenes: string[] = []

  ngOnInit(): void {
    // fs.readdir('../../../../assets/img/home', (err: any, files: any) => {
    //   if (!err) {
    //     this.imagenes = files
    //   }
    // })
  }
}
