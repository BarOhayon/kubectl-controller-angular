import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FetchPods } from 'src/app/shared/actions/pod.action';
import { NamespaceState } from 'src/app/shared/states/namespace.state';

@Injectable({
  providedIn: 'root'
})
export class PodListService {

  @Select(NamespaceState.selectedName) selectedName$!: Observable<string>;

  constructor(private store: Store) {
    this.selectedName$.subscribe((nv) => {
      this.ns = nv;
      this._bool = false;
      this.updateOnSelection();
    })
  }
  get bool() { return this._bool }

  private _bool: boolean = false;
  private ns!: string;

  private interval: any;

  updateOnSelection() {
    if (this._bool) {
      this.interval = setInterval(() => this.store.dispatch(new FetchPods(this.ns)), 1000)
    } else {
      clearInterval(this.interval);
    }

  }

  setSelected(newValue: boolean) {
    this._bool = newValue;
    this.updateOnSelection();
  }
}
