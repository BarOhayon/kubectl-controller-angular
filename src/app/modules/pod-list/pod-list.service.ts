import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FetchPods } from 'src/app/shared/actions/pod.action';
import { Namespace } from 'src/app/shared/models';
import { NamespaceState } from 'src/app/shared/states/namespace.state';

@Injectable({
  providedIn: 'root'
})
export class PodListService {

  @Select(NamespaceState.selectedNamespace) selectedNamespace$!: Observable<Namespace>;

  constructor(private store: Store) {
    this.selectedNamespace$.subscribe((nv) => {
      this.ns = nv;
      this._watchPods = false;
      console.log('selectedNamespace$.subscribe');

      this.updateOnSelection();
    })
  }
  get watchPods() { return this._watchPods }

  private _watchPods: boolean = false;
  private ns!: Namespace;

  private interval: any;

  updateOnSelection() {
    if (this._watchPods) {
      this.interval = setInterval(() => {
        this.store.dispatch(new FetchPods(this.ns))
      }, 1000)
    } else {
      clearInterval(this.interval);
    }

  }

  setWatchPods(newValue: boolean) {
    this._watchPods = newValue;
    this.updateOnSelection();
  }
}
