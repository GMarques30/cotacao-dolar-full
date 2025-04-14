import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cotacao } from './cotacao';
import { CotacaoDolarService } from './cotacaodolar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  dataInicial: string = ""
  dataFinal: string = ""
  cotacaoAtual: number = 0;
  errorMessage: string = "";
  mostrarSomenteCotacoesMenoresAtual: boolean = false;
  cotacaoPorPeriodoLista: Cotacao[] = [];

  constructor(
    private cotacaoDolarService: CotacaoDolarService,
    private dateFormat: DatePipe
  ) {}

  public getCotacoes(): void {
    if(this.mostrarSomenteCotacoesMenoresAtual) {
      this.getCotacaoMenoresAtual(this.dataInicial, this.dataFinal);
    } else {
      this.getCotacaoPorPeriodo(this.dataInicial, this.dataFinal);
    }
  }

  private getCotacaoPorPeriodo(
    dataInicialString: string,
    dataFinalString: string
  ): void {
    if(!this.validadeData(dataInicialString, dataFinalString)) return;

    const dataInicial = this.dateFormat.transform(dataInicialString, "MM-dd-yyyy") || '';
    const dataFinal = this.dateFormat.transform(dataFinalString, "MM-dd-yyyy") || '';

    this.cotacaoDolarService.getCotacaoPorPeriodoFront(dataInicial, dataFinal).subscribe(cotacoes => {
      this.cotacaoPorPeriodoLista = this.requestToCotacaoEntity(cotacoes);
    })
  }

  private getCotacaoMenoresAtual(
    dataInicialString: string,
    dataFinalString: string
  ): void{
    if(!this.validadeData(dataInicialString, dataFinalString)) return;

    const dataInicial = this.dateFormat.transform(dataInicialString, "MM-dd-yyyy") || '';
    const dataFinal = this.dateFormat.transform(dataFinalString, "MM-dd-yyyy") || '';

    this.cotacaoDolarService.getCotacaoMenoresAtualFront(dataInicial, dataFinal).subscribe(cotacoes => {
      this.cotacaoPorPeriodoLista = this.requestToCotacaoEntity(cotacoes);
    })
  }

  private validadeData(dataInicialString: string, dataFinalString: string): boolean {
    if (!dataInicialString || !dataFinalString) {
      this.errorMessage = "Data inicial e final são obrigatórias";
      return false;
    }

    const dataInicial = new Date(dataInicialString);
    const dataFinal = new Date(dataFinalString);
    const dataAtual = new Date();

    if (dataInicial > dataFinal) {
      this.errorMessage = "Data inicial deve ser menor que a data final";
      return false;
    }

    if (dataInicial > dataAtual || dataFinal > dataAtual) {
      this.errorMessage = "As datas devem ser menores que a data atual";
      return false;
    }
    this.errorMessage = "";
    return true;
  }

  private requestToCotacaoEntity(cotacoes: Cotacao[]): Cotacao[] {
    return cotacoes.map(cotacao => ({
      ...cotacao,
      diferenca: `R$ ${(this.cotacaoAtual - cotacao.preco).toFixed(2)}`,
      precoTexto: `R$ ${cotacao.preco.toFixed(2)}`,
      dataTexto: cotacao.data.toString()
    }))
  }

  ngOnInit() {
    const dataAtual = new Date()
    const dataPrimeiroDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);

    this.dataInicial = dataPrimeiroDiaMes.toISOString().substring(0, 10);
    this.dataFinal = dataAtual.toISOString().substring(0, 10);

    this.cotacaoDolarService.getCotacaoAtual().subscribe(cotacao => {
      this.cotacaoAtual = cotacao.preco;
    })
  }
}
