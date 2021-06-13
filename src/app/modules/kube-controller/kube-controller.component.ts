import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FetchNamespaces } from 'src/app/shared/actions/namespace.action';
import { Namespace } from 'src/app/shared/models';
import { NamespaceState } from 'src/app/shared/states/namespace.state';
import { map, startWith, tap } from "rxjs/operators";

@Component({
  selector: 'kube-controller-kube-controller',
  templateUrl: './kube-controller.component.html',
  styleUrls: ['./kube-controller.component.scss']
})
export class KubeControllerComponent implements OnInit {
  @Select(NamespaceState.namespaces) namespaces$!: Observable<Namespace[]>;
  @Select(NamespaceState.selectedName) selectedName$!: Observable<string>;

  constructor(private store: Store) {

  }

  ngOnInit(): void {
  }

}
