import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MesaGridComponent } from './mesa-grid.component'

describe('MesaGridComponent', () => {
  let component: MesaGridComponent
  let fixture: ComponentFixture<MesaGridComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MesaGridComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(MesaGridComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
