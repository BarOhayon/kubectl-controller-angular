import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { JsonConvert } from 'json2typescript';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClearLogs, FetchLogs } from '../actions/log.action';
import { KubectlService } from '../api/kubectl.service';
import { NamespaceState } from './namespace.state';
import { PodState } from './pod.state';

export interface LogStateModel {
    logs: string[];
}

@State<LogStateModel>({
    name: 'Log',
    defaults: {
        logs: [],
    }
})
@Injectable()
export class LogState {
    private static jsonConvert = new JsonConvert();

    constructor(private kubectlService: KubectlService, private store: Store) { }

    @Selector()
    static logs(state: LogStateModel) {
        return state.logs;
    }

    @Action(FetchLogs)
    fetchLogs({ getState, setState }: StateContext<LogStateModel>, action: FetchLogs): Observable<any> {
        console.log('fetchLogs');
        let state = getState();
        let selectedNamespaceName = this.store.selectSnapshot(NamespaceState.selectedNamespace)?.name
        let selectedPodName = this.store.selectSnapshot(PodState.selectedPod)?.name
        if (!selectedNamespaceName) {
            throwError('no nsName')
        }
        if (!selectedPodName) {
            throwError('no podName')
        }
        console.log({ selectedNamespaceName, selectedPodName });

        return this.kubectlService.getLogs(selectedNamespaceName!, selectedPodName!).pipe(
            tap(dtos => {
                console.log('getLogs');

                let logs = dtos;
                setState({ ...state, logs })
            })
        )
    }
    @Action(ClearLogs)
    clearLogs({ getState, setState }: StateContext<LogStateModel>, action: FetchLogs): void {
        let state = getState();
        setState({ ...state, logs: [] })
    }

}


