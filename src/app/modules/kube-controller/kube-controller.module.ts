import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KubeControllerComponent } from './kube-controller.component';
import { NamespaceListComponent } from '../namespace-list/namespace-list.component';
import { PodListComponent } from '../pod-list/pod-list.component';
import { NgxsModule } from '@ngxs/store';
import { NamespaceState } from 'src/app/shared/states/namespace.state';
import { PodState } from 'src/app/shared/states/pod.state';
import { FormsModule } from '@angular/forms';
import { PodListService } from '../pod-list/pod-list.service';
import { NamespaceListService } from '../namespace-list/namespace-list.service';

@NgModule({
  declarations: [
    KubeControllerComponent,
    NamespaceListComponent,
    PodListComponent,
  ],
  imports: [
    NgxsModule.forRoot([NamespaceState, PodState], { developmentMode: true }),
    CommonModule,
    FormsModule
  ],
  exports: [
    KubeControllerComponent,
  ],
  providers: [PodListService, NamespaceListService]
})
export class KubeControllerModule { }
