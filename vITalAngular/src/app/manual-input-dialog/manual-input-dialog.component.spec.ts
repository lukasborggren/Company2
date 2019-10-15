import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualInputDialogComponent } from './manual-input-dialog.component';

describe('ManualInputDialogComponent', () => {
  let component: ManualInputDialogComponent;
  let fixture: ComponentFixture<ManualInputDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualInputDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
