import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SetSelectedPod } from 'src/app/shared/actions/pod.action';
import { Pod } from 'src/app/shared/models/pod';
import { PodState } from 'src/app/shared/states/pod.state';
import { PodListService } from './pod-list.service';

@Component({
    selector: 'kube-controller-pod-list',
    templateUrl: './pod-list.component.html',
    styleUrls: ['./pod-list.component.scss']
})
export class PodListComponent implements OnInit {
    @Select(PodState.pods) pods$!: Observable<Pod[]>

    constructor(private store: Store, public podListService: PodListService) { }

    setSelected(pod: Pod) {
        this.store.dispatch(new SetSelectedPod(pod))
    }

    hasPods$!: Observable<boolean>;


    private getsStatusClass(status: string) {
        if (/.*error.*/.test(status.toLowerCase())) {
            return 'table-danger'
        }
        switch (status) {
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
        // let classStr ='['
        // classStr += this.getsStatusClass(pod.status) + ', ';
        // classStr += ']'
        let classStr: any = {}
        classStr[this.getsStatusClass(pod.status)] = true

        return classStr
    }

    ngOnInit(): void {
        this.hasPods$ = this.pods$.pipe(map(pods => !!pods.length))
    }

}
