import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NamespaceDTO } from '../models';
import { PodDTO } from '../models/pod';

@Injectable()
export class KubectlService {
  private static readonly baseUrl = 'http://localhost:6810';

  constructor(private http: HttpClient) { }

  connectToMongo(namespaceName: string): Observable<{ status: string, pid: number }> { return this.http.get<{ status: string, pid: number }>(`${KubectlService.baseUrl}/connectToMongo?namespaceName=${namespaceName}`); }

  disconnectFromMongo(pid: number): Observable<{ status: string, pid: number }> { return this.http.get<{ status: string, pid: number }>(`${KubectlService.baseUrl}/disconnectFromMongo?pid=${pid}`); }

  getNamespaces(): Observable<NamespaceDTO[]> { return this.http.get<NamespaceDTO[]>(`${KubectlService.baseUrl}/namespaces`); }

  getPods(namespaceName: string): Observable<PodDTO[]> { return this.http.get<PodDTO[]>(`${KubectlService.baseUrl}/pods?namespaceName=${namespaceName}&removeNamePrefix=dataplatform`); }

  getLogs(namespaceName: string, podName: string): Observable<string[]> { return this.http.get<any>(`${KubectlService.baseUrl}/logs?namespaceName=${namespaceName}&podName=${podName}`); }
  getConfig(namespaceName: string, podName: string): Observable<any> { return this.http.get<any>(`${KubectlService.baseUrl}/config?namespaceName=${namespaceName}&podName=${podName}`); }

}
