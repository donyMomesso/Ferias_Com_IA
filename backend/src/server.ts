import cors from "cors";
import "dotenv/config";
import express from "express";
import { generateTripPlan } from "../../lib/ai/adapters";
import { tripRequestSchema } from "../../lib/trips/schema";

const app = express();
const port = Number(process.env.API_PORT || 3333);

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok", service: "ferias-com-ia-api" });
});

app.post("/roteiros", async (request, response) => {
  try {
    const form = tripRequestSchema.parse(request.body);
    const roteiro = await generateTripPlan({ form });

    response.json({ roteiro });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    response.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`API Férias com IA rodando em http://localhost:${port}`);
});
