import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubeControllerComponent } from './kube-controller.component';

describe('KubeControllerComponent', () => {
  let component: KubeControllerComponent;
  let fixture: ComponentFixture<KubeControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubeControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KubeControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
