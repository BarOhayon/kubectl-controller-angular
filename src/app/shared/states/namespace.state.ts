import { State, Action, StateContext, Selector, StateOperator } from '@ngxs/store';
import { Namespace, NamespaceDTO } from '../models/namespace';
import { FetchNamespaces, SetSelectedNamespace } from '../actions/namespace.action';
import { KubectlService } from '../api/kubectl.service';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { JsonConvert } from 'json2typescript';
import { Observable } from 'rxjs';
import { ClearPods, FetchPods } from '../actions/pod.action';
import { ClearLogs } from '../actions/log.action';
import { ClearConfig } from '../actions/config.action';

export interface NamespaceStateModel {
    namespaces: Namespace[];
    selectedNamespace?: Namespace
}

@State<NamespaceStateModel>({
    name: 'Namespace',
    defaults: {
        namespaces: [],
        selectedNamespace: undefined
    }
})
@Injectable()
export class NamespaceState {

    private static jsonConvert = new JsonConvert();

    static deserialize(dto: NamespaceDTO): Namespace {
        return NamespaceState.jsonConvert.deserializeObject(dto, Namespace);
    }

    constructor(private kubectlService: KubectlService) { }

    @Selector()
    static namespaces(state: NamespaceStateModel) {
        return state.namespaces;
    }


    @Selector()
    static selectedName(state: NamespaceStateModel) {
        return state.selectedNamespace?.name;
    }

    @Selector()
    static selectedNamespace(state: NamespaceStateModel) {
        return state.selectedNamespace;
    }

    @Action(FetchNamespaces)
    fetchNamespaces({ getState, setState }: StateContext<NamespaceStateModel>, action: FetchNamespaces): Observable<any> {
        let state = getState();
        return this.kubectlService.getNamespaces().pipe(
            tap(dtos => {
                let namespaces = dtos.map(NamespaceState.deserialize);
                setState({ ...state, namespaces })
            })
        )
    }

    @Action(SetSelectedNamespace)
    setSelectedNamespace({ getState, setState, dispatch }: StateContext<NamespaceStateModel>, action: SetSelectedNamespace): void {
        let state = getState();
        let selectedNs = action.selectedNamespace;
        setState({ ...state, selectedNamespace: selectedNs });
        dispatch([new ClearPods(), new ClearLogs(), new ClearConfig()]).subscribe(() => dispatch(new FetchPods()));
    }
}


