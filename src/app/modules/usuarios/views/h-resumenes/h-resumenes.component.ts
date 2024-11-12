import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'pa-h-resumenes',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './h-resumenes.component.html',
  styleUrls: ['./h-resumenes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HResumenesComponent implements OnInit {

  ngOnInit(): void { }

}
