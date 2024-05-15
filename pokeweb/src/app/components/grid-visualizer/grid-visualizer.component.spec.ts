import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridVisualizerComponent } from './grid-visualizer.component';

describe('GridVisualizerComponent', () => {
  let component: GridVisualizerComponent;
  let fixture: ComponentFixture<GridVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridVisualizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
