import { State, Action, StateContext, Selector, StateOperator } from '@ngxs/store';
import { Namespace, NamespaceDTO } from '../models/namespace';
import { FetchNamespaces, SetSelectedNamespace } from '../actions/namespace.action';
import { KubectlService } from '../api/kubectl.service';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { JsonConvert } from 'json2typescript';
import { Observable } from 'rxjs';

export interface NamespaceStateModel {
    namespaces: Namespace[];
    selectedId?: number
}

@State<NamespaceStateModel>({
    name: 'Namespace',
    defaults: {
        namespaces: [],
        selectedId: undefined
    }
})
@Injectable()
export class NamespaceState {

    private static jsonConvert = new JsonConvert();

    static deserialize(dto: NamespaceDTO): Namespace {
        return NamespaceState.jsonConvert.deserializeObject(dto, Namespace);
    }

    constructor(private NamespaceService: KubectlService) { }

    @Selector()
    static namespaces(state: NamespaceStateModel) {
        return state.namespaces;
    }

    @Selector()
    static selectedId(state: NamespaceStateModel) {
        return state.selectedId;
    }

    @Action(FetchNamespaces)
    fetchNamespaces({ getState, setState }: StateContext<NamespaceStateModel>, action: FetchNamespaces): Observable<any> {
        let state = getState();
        return this.NamespaceService.getNamespaces().pipe(
            tap(dtos => {
                let namespaces = dtos.map(NamespaceState.deserialize);
                let selectedId = namespaces.length ? state.selectedId || 0 : undefined;
                setState({ ...state, namespaces, selectedId })

            })
        )
    }
    @Action(SetSelectedNamespace)
    setSelectedNamespace({ getState, setState }: StateContext<NamespaceStateModel>, action: SetSelectedNamespace): void {
        let state = getState();
        let newState = { ...state, selectedId: action.selectedNamespace.id }
        console.log({ state, newState });
        setState(newState)
    }
}


