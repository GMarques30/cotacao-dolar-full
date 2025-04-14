import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cotacao } from './cotacao';

@Injectable({ providedIn: 'root' })
export class CotacaoDolarService {
  private apiServerUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  public getCotacaoAtual(): Observable<Cotacao> {
    return this.http.get<Cotacao>(`${this.apiServerUrl}/moeda/atual`);
  }

  public getCotacaoPorPeriodoFront(
    dataInicial: string,
    dataFinal: string
  ): Observable<Cotacao[]> {
    return this.http.get<Cotacao[]>(`${this.apiServerUrl}/moeda/${dataInicial}&${dataFinal}`);
  }

  public getCotacaoMenoresAtualFront(
    dataInicial: string,
    dataFinal: string
  ): Observable<Cotacao[]> {
    return this.http.get<Cotacao[]>(`${this.apiServerUrl}/moeda/menor-atual/${dataInicial}&${dataFinal}`);
  }
}
