import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FetchNamespaces } from 'src/app/shared/actions/namespace.action';
import { KubectlService } from 'src/app/shared/api/kubectl.service';
import { NamespaceState } from 'src/app/shared/states/namespace.state';

@Injectable({
  providedIn: 'root'
})
export class NamespaceListService {
  @Select(NamespaceState.selectedName) selectedName$!: Observable<string>;


  get watchNamespaces() { return this._watchNamespaces }
  get connectToMongo() { return this._connectToMongo }

  private _watchNamespaces: boolean = true;
  private _selectedNameSpaceName?: string;
  private _connectToMongo: boolean = false;
  private _mongoConnectionPid?: number;

  private interval: any;

  constructor(private store: Store, private kubectlService: KubectlService) {
    this.updateOnSelection();
    this.selectedName$.subscribe((nv) => {
      console.log('selectedName$.sub', { nv });

      this._selectedNameSpaceName = nv;
      if (this._mongoConnectionPid) {
        console.log('disconnectMongo');

        this.setConnectToMongo(false)
      }
    })
  }

  updateOnSelection() {
    if (this._watchNamespaces) {
      console.log('watch ns');

      this.interval = setInterval(() => this.store.dispatch(new FetchNamespaces()), 5000);
    } else {
      console.log('stop watch ns');
      clearInterval(this.interval);
    }

  }

  setWatchNamespace(newValue: boolean) {
    this._watchNamespaces = newValue;
    this.updateOnSelection();
  }

  setConnectToMongo(newValue: boolean) {
    this._connectToMongo = newValue;
    if (this._mongoConnectionPid) {
      this.kubectlService.disconnectFromMongo(this._mongoConnectionPid!).subscribe((nv) => {
        console.log({ disconnectFromMongo: nv });
        this._mongoConnectionPid = undefined
      });

    } else if (this._selectedNameSpaceName) {
      this.kubectlService.connectToMongo(this._selectedNameSpaceName).subscribe((nv) => {
        console.log({ newVal: nv });
        this._mongoConnectionPid = nv.pid
      });
    }
  }
}
