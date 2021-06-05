import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KubeControllerModule } from './modules/kube-controller/kube-controller.module';
import { KubectlService } from './shared/api/kubectl.service';
import { NamespaceState } from './shared/states/namespace.state';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    NgxsModule.forRoot([NamespaceState], { developmentMode: true }),
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    KubeControllerModule,
    NgbModule,
    FormsModule,
  ],
  providers: [KubectlService],
  bootstrap: [AppComponent]
})
export class AppModule { }
