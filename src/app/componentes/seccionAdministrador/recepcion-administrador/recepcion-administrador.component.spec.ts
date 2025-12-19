import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionAdministradorComponent } from './recepcion-administrador.component';

describe('RecepcionAdministradorComponent', () => {
  let component: RecepcionAdministradorComponent;
  let fixture: ComponentFixture<RecepcionAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecepcionAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
