import { Namespace } from "../models";

export class FetchNamespaces {
    static readonly type = '[Namespace] Fetch';

    constructor() { }
}
export class SetSelectedNamespace {
    static readonly type = '[Namespace] SetSelected';

    constructor(public selectedNamespace: Namespace) { }
}
