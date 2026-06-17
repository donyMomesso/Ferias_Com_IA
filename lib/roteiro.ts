type FormRoteiro = {
  destino: string;
  datas: string;
  pessoas: string;
  objetivo: string;
  orcamento: string;
};

export function gerarRoteiroDemo(form: FormRoteiro) {
  return `ROTEIRO GERADO – FÉRIAS COM IA

Destino: ${form.destino}
Datas: ${form.datas}
Pessoas: ${form.pessoas}
Objetivo: ${form.objetivo}
Orçamento: ${form.orcamento}

DIA 1 – Chegada
Check-in, reconhecimento da região, caminhada leve e jantar próximo da hospedagem.

DIA 2 – Experiência local
Centro histórico, pontos turísticos, fotos da família e primeiro contato com prestadores locais.

DIA 3 – Dia principal do objetivo
Atividade principal da viagem conforme o perfil escolhido: pesca, praia, aventura, gastronomia ou descanso.

DIA 4 – Passeio premium
Passeio de barco, trilha, praia especial, guia local ou experiência gastronômica.

DIA 5 – Dia livre inteligente
A IA sugere opções conforme clima, distância, orçamento e energia da família.

DIA 6 – Última experiência marcante
Pôr do sol, jantar especial e foto oficial da viagem.

DIA 7 – Retorno
Café da manhã, checkout e volta com paradas sugeridas.

PRÓXIMA ETAPA DO APP:
Conectar IA real, banco de parceiros locais, mapas e geração de PDF.`;
}
