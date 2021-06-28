import { Namespace } from "../models";
import { Pod } from "../models/pod";

export class FetchPods {
    static readonly type = '[Pod] Fetch';

    constructor() { }
}

export class SetSelectedPod {
    static readonly type = '[Pod] SetSelected';

    constructor(public selectedPod: Pod) { }
}

export class ClearPods {
    static readonly type = '[Pod] ClearPods';
    constructor() { }
}
