import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NamespaceDTO } from '../models';

@Injectable()
export class KubectlService {
  private static readonly baseUrl = 'http://localhost:6810';

  constructor(private http: HttpClient) { }

  getNamespaces(): Observable<NamespaceDTO[]> { return this.http.get<NamespaceDTO[]>(`${KubectlService.baseUrl}/namespaces`); }
  getPods(namespaceName: string): Observable<NamespaceDTO[]> { return this.http.get<NamespaceDTO[]>(`${KubectlService.baseUrl}/pods?namespace=${namespaceName}`); }
}
