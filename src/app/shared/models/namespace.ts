import { JsonObject, JsonProperty } from 'json2typescript';

export interface NamespaceDTO { _id: number, name: string, status: string, age: string };

@JsonObject('Namespace')
export class Namespace {
    @JsonProperty('_id', Number)
    public id: number;

    @JsonProperty('name', String)
    public name: string;

    @JsonProperty('status', String)
    public status: string;

    @JsonProperty('age', String)
    public age: string;

    constructor(
        id?: number,
        name?: string,
        status?: string,
        age?: string,
    ) {
        this.id = id || 0;
        this.name = name || 'UNKNOWN';
        this.status = status || 'UNKNOWN';
        this.age = age || 'UNKNOWN';
    }
}
