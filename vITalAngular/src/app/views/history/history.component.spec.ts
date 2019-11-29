import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import {ChartsModule} from 'ng2-charts';
import { Location, LocationStrategy , PathLocationStrategy} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';




describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryComponent ],
      imports: [ChartsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
