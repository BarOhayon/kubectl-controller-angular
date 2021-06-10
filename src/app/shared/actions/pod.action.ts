import { Pod } from "../models/pod";

export class FetchPods {
    static readonly type = '[pod] Fetch';

    constructor(public namespaceName: string) { }
}

export class SetSelectedPod {
    static readonly type = '[Pod] SetSelected';

    constructor(public selectedPod: Pod) { }
}

export class ClearPods {
    static readonly type = '[Pod] ClearPods';
    constructor() { }
}
