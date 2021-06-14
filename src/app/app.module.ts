import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KubeControllerModule } from './modules/kube-controller/kube-controller.module';
import { KubectlService } from './shared/api/kubectl.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    KubeControllerModule,
    NgbModule,
    FormsModule,
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
  providers: [KubectlService],
  bootstrap: [AppComponent]
})
export class AppModule { }
