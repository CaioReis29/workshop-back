export class Workshop {
  id: number;
  nome: string;
  dataRealizacao: Date;
  descricao: string;

  constructor(id: number, nome: string, dataRealizacao: Date, descricao: string) {
    this.id = id;
    this.nome = nome;
    this.dataRealizacao = dataRealizacao;
    this.descricao = descricao;
  }
}
