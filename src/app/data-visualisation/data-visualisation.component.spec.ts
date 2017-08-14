import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataVisualisationComponent } from './data-visualisation.component';

describe('DataVisualisationComponent', () => {
  let component: DataVisualisationComponent;
  let fixture: ComponentFixture<DataVisualisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataVisualisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataVisualisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
