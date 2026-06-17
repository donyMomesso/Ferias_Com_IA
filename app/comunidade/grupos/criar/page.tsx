"use client";

import { useState } from "react";
import { communityCategories } from "../../../../lib/community/demo";

export default function CriarGrupoPage() {
  const [status, setStatus] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Formulário pronto. Conecte um userId real para gravar no banco.");
  }

  return (
    <main className="community-page">
      <section className="community-form-section">
        <p className="eyebrow">Criar comunidade</p>
        <h1>Novo grupo local</h1>
        <form className="community-form" onSubmit={submit}>
          <input name="name" placeholder="Nome do grupo" required />
          <textarea name="description" placeholder="Descrição" required />
          <select name="category" required>
            {communityCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <input name="city" placeholder="Cidade" required />
          <input name="state" placeholder="Estado" />
          <input name="coverImage" placeholder="URL da imagem de capa" />
          <label className="community-check">
            <input type="checkbox" name="isPrivate" />
            Grupo privado
          </label>
          <button className="btn-generate" type="submit">Criar grupo</button>
          {status && <p className="msg-sucesso">{status}</p>}
        </form>
      </section>
    </main>
  );
}
