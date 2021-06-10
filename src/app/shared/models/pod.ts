import { JsonObject, JsonProperty } from 'json2typescript';

export interface PodDTO {
    _id: string
    name: string;
    displayName: string;
    ready: string;
    status: string;
    restarts: string;
    age: string;
};

@JsonObject('Pod')
export class Pod {
    @JsonProperty('_id', String)
    public id: string;
    @JsonProperty('name', String)
    public name: string;
    @JsonProperty('displayName', String)
    public displayName: string;
    @JsonProperty('ready', String)
    public ready: string;
    @JsonProperty('status', String)
    public status: string;
    @JsonProperty('restarts', String)
    public restarts: string;
    @JsonProperty('age', String)
    public age: string;
    @JsonProperty('index', String)
    public index: string;



    constructor(
        _id?: string,
        name?: string,
        displayName?: string,
        index?: string,
        ready?: string,
        status?: string,
        restarts?: string,
        age?: string,
    ) {
        this.id = _id || '0';
        this.name = name || 'UNKNOWN';
        this.displayName = displayName || 'UNKNOWN';
        this.index = index || 'UNKNOWN';
        this.ready = ready || 'UNKNOWN';
        this.status = status || 'UNKNOWN';
        this.restarts = restarts || 'UNKNOWN';
        this.age = age || 'UNKNOWN';
    }
}
