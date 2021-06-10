import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NamespaceDTO } from '../models';
import { PodDTO } from '../models/pod';

@Injectable()
export class KubectlService {
  private static readonly baseUrl = 'http://localhost:6810';

  constructor(private http: HttpClient) { }

  getNamespaces(): Observable<NamespaceDTO[]> { return this.http.get<NamespaceDTO[]>(`${KubectlService.baseUrl}/namespaces`); }
  getPods(namespaceName: string): Observable<PodDTO[]> { return this.http.get<PodDTO[]>(`${KubectlService.baseUrl}/pods?namespaceName=${namespaceName}&removeNamePrefix=dataplatform`); }
}
