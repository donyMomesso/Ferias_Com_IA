import { z } from "zod";

export const tripRequestSchema = z.object({
  destino: z.string().trim().min(2, "Informe o destino."),
  datas: z.string().trim().min(2, "Informe as datas."),
  pessoas: z.string().trim().min(1, "Informe as pessoas da viagem."),
  objetivo: z.string().trim().min(3, "Informe o objetivo da viagem."),
  orcamento: z.string().trim().min(2, "Informe o orçamento.")
});
