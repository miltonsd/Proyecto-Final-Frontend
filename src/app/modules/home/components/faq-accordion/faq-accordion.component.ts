import { Component, Input } from '@angular/core'

@Component({
  selector: 'pa-faq-accordion',
  templateUrl: './faq-accordion.component.html',
  styleUrls: ['./faq-accordion.component.css']
})
export class FaqAccordionComponent {
  @Input() question!: string
  @Input() answer!: string
}
