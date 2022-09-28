import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportistaDialogComponent } from './transportista-dialog.component';

describe('TransportistaDialogComponent', () => {
  let component: TransportistaDialogComponent;
  let fixture: ComponentFixture<TransportistaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportistaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportistaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
