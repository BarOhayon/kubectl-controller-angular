import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KubeControllerComponent } from './kube-controller.component';
import { NamespaceListComponent } from '../namespace-list/namespace-list.component';
import { PodListComponent } from '../pod-list/pod-list.component';

@NgModule({
  declarations: [
    KubeControllerComponent,
    NamespaceListComponent,
    PodListComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    KubeControllerComponent,
  ]
})
export class KubeControllerModule { }
