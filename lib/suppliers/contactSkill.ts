import type { SupplierContactDraft } from "../agents/types";
import type { TripRequest } from "../trips/types";

export function createSupplierContactDrafts(request: TripRequest): SupplierContactDraft[] {
  return [
    {
      supplierName: "Fornecedor local da experiência principal",
      channel: "whatsapp",
      destination: request.destino,
      objective: request.objetivo,
      message: `Olá! Estou planejando uma viagem para ${request.destino}, nas datas ${request.datas}, para ${request.pessoas}. O objetivo é ${request.objetivo}. Pode informar disponibilidade, valores, duração, ponto de encontro, o que está incluso e política de cancelamento?`
    },
    {
      supplierName: "Restaurante parceiro",
      channel: "whatsapp",
      destination: request.destino,
      objective: "Reserva e recomendação de experiência gastronômica",
      message: `Olá! Gostaria de verificar opções para uma família em viagem para ${request.destino}, no período ${request.datas}. Vocês trabalham com reserva? Têm sugestão de pratos locais e melhor horário para ir com crianças?`
    }
  ];
}
