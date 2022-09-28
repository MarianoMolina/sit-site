import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarHabilitacionDialogComponent } from './agregar-habilitacion-dialog.component';

describe('AgregarHabilitacionDialogComponent', () => {
  let component: AgregarHabilitacionDialogComponent;
  let fixture: ComponentFixture<AgregarHabilitacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarHabilitacionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarHabilitacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
