import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { JsonConvert } from 'json2typescript';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClearPods, FetchPods } from '../actions/pod.action';
import { KubectlService } from '../api/kubectl.service';
import { Pod, PodDTO } from '../models/pod';

export interface PodStateModel {
    pods: Pod[];
    selectedId?: string
}

@State<PodStateModel>({
    name: 'Pod',
    defaults: {
        pods: [],
        selectedId: undefined,
    }
})
@Injectable()
export class PodState {

    private static jsonConvert = new JsonConvert();

    static deserialize(dto: PodDTO): Pod {
        return PodState.jsonConvert.deserializeObject(dto, Pod);
    }


    constructor(private KubectlService: KubectlService) { }

    private sortPods(pods: Pod[]) {
        let sorted = []
        let mongodbPods = pods.filter(pod => pod.name.includes('mongodb'))
        if (mongodbPods) {
            sorted.push(...mongodbPods);
        }
        sorted.push(...pods.filter(pod => !pod.name.includes('mongodb')))
        return sorted
    }

    @Selector()
    static pods(state: PodStateModel) {
        return state.pods;
    }

    @Selector()
    static selectedId(state: PodStateModel) {
        return state.selectedId;
    }

    @Action(FetchPods)
    fetchPods({ getState, setState }: StateContext<PodStateModel>, action: FetchPods): Observable<any> {
        let state = getState();
        return this.KubectlService.getPods(action.namespaceName).pipe(
            tap(dtos => {
                let pods = dtos.map(PodState.deserialize);

                let selectedId = pods.length ? state.selectedId || '0' : undefined;
                setState({ ...state, pods: this.sortPods(pods), selectedId })
            })
        )
    }

    @Action(ClearPods)
    clearPods({ getState, setState }: StateContext<PodStateModel>, action: FetchPods): void {
        let state = getState();
        setState({ ...state, pods: [] })
    }

}

