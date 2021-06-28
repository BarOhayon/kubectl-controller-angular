import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FetchConfig } from 'src/app/shared/actions/config.action';
import { ConfigState } from 'src/app/shared/states/config.state';

@Component({
  selector: 'kube-controller-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss']
})
export class ConfigListComponent implements OnInit {
  @Select(ConfigState.config) config$!: Observable<any>
  constructor(private store: Store) { }


  ngOnInit(): void {
  }

}
