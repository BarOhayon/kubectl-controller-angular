import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FetchNamespaces, SetSelectedNamespace } from 'src/app/shared/actions/namespace.action';
import { Namespace } from 'src/app/shared/models';
import { NamespaceState } from 'src/app/shared/states/namespace.state';
import { NamespaceListService } from './namespace-list.service';

@Component({
  selector: 'kube-controller-namespace-list',
  templateUrl: './namespace-list.component.html',
  styleUrls: ['./namespace-list.component.scss']
})
export class NamespaceListComponent implements OnInit {
  @Select(NamespaceState.namespaces) namespaces$!: Observable<Namespace[]>;
  @Select(NamespaceState.selectedName) selectedName$!: Observable<string>;

  constructor(private store: Store, public namespaceListService: NamespaceListService) {

  }

  getRowClass(namespace: Namespace): Observable<string> {
    return this.selectedName$.pipe(
      map(selectedName => {
        if (namespace.name === selectedName) {
          return 'table-primary'
        }
        switch (namespace.status.toLowerCase()) {
          case 'active':
            return 'table-success'
          default:
            return 'table-default'
        }
      })
    )
  }

  setSelected(namespace: Namespace) {
    this.store.dispatch(new SetSelectedNamespace(namespace))
  }

  ngOnInit(): void {
    this.store.dispatch(new FetchNamespaces());
  }

}
