import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { JsonConvert } from 'json2typescript';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PodListService } from 'src/app/modules/pod-list/pod-list.service';
import { ClearPods, FetchPods, SetSelectedPod } from '../actions/pod.action';
import { KubectlService } from '../api/kubectl.service';
import { Pod, PodDTO } from '../models/pod';

export interface PodStateModel {
    pods: Pod[];
    selectedPod?: Pod
}

@State<PodStateModel>({
    name: 'Pod',
    defaults: {
        pods: [],
        selectedPod: undefined,
    }
})
@Injectable()
export class PodState {

    private static jsonConvert = new JsonConvert();

    static deserialize(dto: PodDTO): Pod {
        return PodState.jsonConvert.deserializeObject(dto, Pod);
    }


    constructor(private KubectlService: KubectlService, private podlistService: PodListService) { }

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
    static selectedPod(state: PodStateModel) {
        return state.selectedPod;
    }

    @Action(FetchPods)
    fetchPods({ getState, setState }: StateContext<PodStateModel>, action: FetchPods): Observable<any> {
        let state = getState();
        return this.KubectlService.getPods(action.selectedNamespace.name).pipe(
            catchError((err) => {
                console.log('error caught in service')
                console.error(err);
                this.podlistService.setWatchPods(false);
                setState({ ...state, pods: [], selectedPod: undefined })
                return throwError(err);    //Rethrow it back to component
            }),
            tap(dtos => {
                let pods = dtos.map(PodState.deserialize);
                setState({ ...state, pods: this.sortPods(pods) })
            })
        )
    }

    @Action(ClearPods)
    clearPods({ getState, setState }: StateContext<PodStateModel>, action: FetchPods): void {
        let state = getState();
        setState({ ...state, pods: [] })
    }


    @Action(SetSelectedPod)
    setSelectedPod({ getState, setState }: StateContext<PodStateModel>, action: SetSelectedPod): void {
        let state = getState();
        let selectedPod = action.selectedPod;
        setState({ ...state, selectedPod });
    }

}

