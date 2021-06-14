import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LogState } from 'src/app/shared/states/log.state';

@Component({
  selector: 'kube-controller-logs-list',
  templateUrl: './logs-list.component.html',
  styleUrls: ['./logs-list.component.scss']
})
export class LogsListComponent implements OnInit {

  @Select(LogState.logs) logs$!: Observable<string[]>
  constructor() { }

  ngOnInit(): void {
  }

}
