import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaAdminComponent } from './area-admin.component';

describe('AreaAdminComponent', () => {
  let component: AreaAdminComponent;
  let fixture: ComponentFixture<AreaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
