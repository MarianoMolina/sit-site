import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransportistaComponent } from './add-transportista.component';

describe('AddTransportistaComponent', () => {
  let component: AddTransportistaComponent;
  let fixture: ComponentFixture<AddTransportistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTransportistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTransportistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
