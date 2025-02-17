import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutVenteDirectorComponent } from './ajout-vente-director.component';

describe('AjoutVenteDirectorComponent', () => {
  let component: AjoutVenteDirectorComponent;
  let fixture: ComponentFixture<AjoutVenteDirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutVenteDirectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutVenteDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
