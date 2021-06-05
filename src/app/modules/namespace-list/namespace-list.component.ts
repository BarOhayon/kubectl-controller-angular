import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FetchNamespaces, SetSelectedNamespace } from 'src/app/shared/actions/namespace.action';
import { Namespace } from 'src/app/shared/models';
import { NamespaceState } from 'src/app/shared/states/namespace.state';

@Component({
  selector: 'kube-controller-namespace-list',
  templateUrl: './namespace-list.component.html',
  styleUrls: ['./namespace-list.component.scss']
})
export class NamespaceListComponent implements OnInit {
  @Select(NamespaceState.namespaces) namespaces$!: Observable<Namespace[]>;
  @Select(NamespaceState.selectedId) selectedId$!: Observable<number>;

  constructor(private store: Store) {

  }

  getRowClass(namespace: Namespace) {
    switch (namespace.status.toLowerCase()) {
      case 'active':
        return 'table-success'
      default:
        return 'table-default'
    }
  }

  setSelected(namespace: Namespace) {
    this.store.dispatch(new SetSelectedNamespace(namespace))

  }

  ngOnInit(): void {
    this.store.dispatch(new FetchNamespaces());
  }

}
