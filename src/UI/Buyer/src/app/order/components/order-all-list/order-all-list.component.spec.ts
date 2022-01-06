import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAllListComponent } from './order-all-list.component';

describe('OrderAllListComponent', () => {
  let component: OrderAllListComponent;
  let fixture: ComponentFixture<OrderAllListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAllListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAllListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
