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
import { LogsListComponent } from '../logs-list/logs-list.component';
import { LogState } from 'src/app/shared/states/log.state';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ConfigListComponent } from '../config-list/config-list.component';
import { ConfigState } from 'src/app/shared/states/config.state';

@NgModule({
  declarations: [
    KubeControllerComponent,
    NamespaceListComponent,
    PodListComponent,
    LogsListComponent,
    ConfigListComponent,
  ],
  imports: [
    NgxsModule.forRoot([NamespaceState, PodState, LogState, ConfigState], { developmentMode: true }),
    CommonModule,
    FormsModule,
    NgxJsonViewerModule,
  ],
  exports: [
    KubeControllerComponent,
  ],
  providers: [PodListService, NamespaceListService]
})
export class KubeControllerModule { }
