import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoDialogComponent } from './contacto-dialog.component';

describe('ContactoDialogComponent', () => {
  let component: ContactoDialogComponent;
  let fixture: ComponentFixture<ContactoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
