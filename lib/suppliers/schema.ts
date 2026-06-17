import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do fornecedor."),
  destination: z.string().trim().min(2, "Informe o destino."),
  category: z.string().trim().min(2, "Informe a categoria."),
  phone: z.string().trim().optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  website: z.string().trim().url().optional().or(z.literal("")),
  rating: z.number().min(0).max(5).optional(),
  source: z.string().trim().optional(),
  notes: z.string().trim().optional()
});
