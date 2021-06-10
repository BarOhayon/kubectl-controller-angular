import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { FetchNamespaces } from 'src/app/shared/actions/namespace.action';

@Injectable({
  providedIn: 'root'
})
export class NamespaceListService {

  constructor(private store: Store) { }
  get bool() { return this._bool }

  private _bool: boolean = true;

  private interval: any;

  updateOnSelection() {
    if (this._bool) {
      this.interval = setInterval(() => this.store.dispatch(new FetchNamespaces()), 5000);
    } else {
      clearInterval(this.interval);
    }

  }

  setSelected(newValue: boolean) {
    this._bool = newValue;
    this.updateOnSelection();
  }
}
