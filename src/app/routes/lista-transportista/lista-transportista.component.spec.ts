import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTransportistaComponent } from './lista-transportista.component';

describe('ListaTransportistaComponent', () => {
  let component: ListaTransportistaComponent;
  let fixture: ComponentFixture<ListaTransportistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaTransportistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaTransportistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
