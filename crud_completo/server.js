import express from "express";
import db from "../db/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Pessoa from "./models/pessoa.js";

// __dirname não existe em ESM — recriamos a partir de import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

db.then(() => console.log("MongoDB conectado")).catch((err) =>
  console.log(err),
);
// ==================== CRUD ====================

/** CREATE - cria uma rota post
 * POST http://localhost:3000/pessoas
 * req → contém os dados enviados pelo cliente
 * res → é a resposta que vamos devolver
 * cria uma pessoa com os dados do body
 * salva no banco
 * pega a resposta **/

app.post("/pessoas", async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;

    if (!nome) {
      return res.status(400).json({ mensagem: "Nome é obrigatório" });
    }

    if (!email) {
      return res.status(400).json({ mensagem: "Email é obrigatório" });
    }

    const pessoa = await Pessoa.create({ nome, email, telefone });

    return res.status(201).json(pessoa);
  } catch (err) {
    return res
      .status(500)
      .json({ mensagem: "Erro interno", erro: err.message });
  }
});

// READ
app.get("/pessoas", async (req, res) => {
  const pessoas = await Pessoa.find().sort({ dataCadastro: -1 });
  res.json(pessoas);
});

app.get("/pessoas/nome/:nome", async (req, res) => {
  const pessoa = await Pessoa.find({ nome: req.params.nome });
  res.json(pessoa);
});

// UPDATE
app.put("/pessoas/:id", async (req, res) => {
  const atualizada = await Pessoa.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(atualizada);
});

// DELETE
app.delete("/pessoas/:id", async (req, res) => {
  await Pessoa.findByIdAndDelete(req.params.id);
  res.json({ mensagem: "Pessoa removida" });
});

// Servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
