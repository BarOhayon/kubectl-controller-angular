import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FetchConfig } from 'src/app/shared/actions/config.action';
import { SetSelectedPod } from 'src/app/shared/actions/pod.action';
import { Pod } from 'src/app/shared/models/pod';
import { NamespaceState } from 'src/app/shared/states/namespace.state';
import { PodState } from 'src/app/shared/states/pod.state';
import { PodListService } from './pod-list.service';

@Component({
    selector: 'kube-controller-pod-list',
    templateUrl: './pod-list.component.html',
    styleUrls: ['./pod-list.component.scss']
})
export class PodListComponent implements OnInit {
    @Select(PodState.pods) pods$!: Observable<Pod[]>
    @Select(PodState.selectedPod) selectedPod$!: Observable<Pod>
    @Select(NamespaceState.selectedName) selectedNsName$!: Observable<string>

    constructor(private store: Store, public podListService: PodListService) { }

    setSelected(pod: Pod) {
        this.store.dispatch(new SetSelectedPod(pod))
    }

    getConfig() {
        console.log('oe');

        this.store.dispatch(new FetchConfig())
    }

    hasPods$!: Observable<boolean>;


    private getsStatusClass(status: string) {
        if (/.*error.*/.test(status.toLowerCase())) {
            status = 'Error'
        }
        switch (status) {
            case 'Error':
                return 'table-danger'
            case 'Running':
                return 'table-success'
            case 'Evicted':
                return 'table-danger'
            case 'CrashLoopBackOff':
                return 'table-warning'
            case 'Pending':
                return 'table-dark'
            case 'ContainerCreating':
                return 'table-secondary'
            case 'Terminating':
                return 'table-light'
            default:
                return 'table-default'
        }
    }
    getReadyClass(readyState: string) {
        let s = readyState.split('/')
        if (s[0] !== s[1]) {
            return { 'text-danger': true }
        }
        return {}

    }
    getRowClass(pod: Pod) {
        return this.selectedPod$.pipe(
            map(selectedPod => {
                let classStr: any = {}
                if (selectedPod && pod.name === selectedPod.name) {
                    classStr['table-primary'] = true
                } else {
                    classStr[this.getsStatusClass(pod.status)] = true

                }
                return classStr
            })
        )

    }

    ngOnInit(): void {
        this.hasPods$ = this.pods$.pipe(map(pods => !!pods.length))
    }

}
