import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClearConfig, FetchConfig } from '../actions/config.action';
import { KubectlService } from '../api/kubectl.service';
import { NamespaceState } from './namespace.state';
import { PodState } from './pod.state';

export interface ConfigStateModel {
    config?: any;
}

@State<ConfigStateModel>({
    name: 'Config',
    defaults: {
        config: undefined,
    }
})
@Injectable()
export class ConfigState {

    constructor(private kubectlService: KubectlService, private store: Store) { }

    @Selector()
    static config(state: ConfigStateModel) {
        return state.config;
    }

    @Action(FetchConfig)
    fetchConfig({ getState, setState }: StateContext<ConfigStateModel>, action: FetchConfig): Observable<any> {
        console.log('fetchConfig');
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

        return this.kubectlService.getConfig(selectedNamespaceName!, selectedPodName!).pipe(
            tap(dtos => {
                setState({ ...state, config: dtos })
            })
        )
    }

    @Action(ClearConfig)
    clearConfig({ getState, setState }: StateContext<ConfigStateModel>, action: ClearConfig) {
        let state = getState();
        setState({ config: undefined })
    }

}

