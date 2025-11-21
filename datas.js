import axios from "axios";
import FormData from "form-data";
import fs from "fs";

// URL e token
const apiURL = "http://localhost:3000/exercicios";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbmRyZWFpbHRvbjFAZ21haWwuY29tIiwidGlwbyI6InRyZWluYWRvciIsImlhdCI6MTc2MzQzOTY5MywiZXhwIjoxNzY2MDMxNjkzfQ.IdAqz3pc-uNUiwqIcNlbdW9nq5trRdjDvM5WvV3EY0c";

// JSON de exercícios
const exercicios = [
  {
    "nome": "Leg Press",
    "Categoria": "Perna",
    "Grupo_Muscular": "Glúteos",
    "Descricao": "Exercício voltado para o fortalecimento dos glúteos e quadríceps.",
    "Aparelho": "Leg Press",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Agachamento Livre",
    "Categoria": "Perna",
    "Grupo_Muscular": "Quadríceps",
    "Descricao": "Trabalha os principais músculos das pernas, com foco em quadríceps e glúteos.",
    "Aparelho": "Barra ou peso corporal",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Cadeira Extensora",
    "Categoria": "Perna",
    "Grupo_Muscular": "Quadríceps",
    "Descricao": "Isola os músculos do quadríceps durante a extensão dos joelhos.",
    "Aparelho": "Cadeira Extensora",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Mesa Flexora",
    "Categoria": "Perna",
    "Grupo_Muscular": "Posterior de Coxa",
    "Descricao": "Trabalha os isquiotibiais com flexão dos joelhos.",
    "Aparelho": "Mesa Flexora",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Avanço com Halteres",
    "Categoria": "Perna",
    "Grupo_Muscular": "Glúteos",
    "Descricao": "Desenvolve glúteos e quadríceps com movimentos alternados.",
    "Aparelho": "Halteres",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Panturrilha em Pé",
    "Categoria": "Perna",
    "Grupo_Muscular": "Panturrilha",
    "Descricao": "Isola e fortalece os músculos da panturrilha.",
    "Aparelho": "Máquina de Panturrilha",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Puxada na Frente",
    "Categoria": "Costas",
    "Grupo_Muscular": "Dorsal",
    "Descricao": "Fortalece a parte superior das costas com foco no dorsal largo.",
    "Aparelho": "Puxada na Polia",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Remada Curvada",
    "Categoria": "Costas",
    "Grupo_Muscular": "Costas Intermediárias",
    "Descricao": "Trabalha a musculatura média das costas utilizando uma barra.",
    "Aparelho": "Barra",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Serrote",
    "Categoria": "Costas",
    "Grupo_Muscular": "Dorsal",
    "Descricao": "Fortalece o grande dorsal e trapézio usando halteres.",
    "Aparelho": "Halter",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Remada Sentada",
    "Categoria": "Costas",
    "Grupo_Muscular": "Costas",
    "Descricao": "Exercício sentado para trabalhar o meio das costas.",
    "Aparelho": "Máquina de Remada",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Levantamento Terra",
    "Categoria": "Costas",
    "Grupo_Muscular": "Lombar",
    "Descricao": "Exercício composto que fortalece a região lombar e posterior das pernas.",
    "Aparelho": "Barra",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Pullover",
    "Categoria": "Costas",
    "Grupo_Muscular": "Dorsal",
    "Descricao": "Trabalha o grande dorsal e músculos do peitoral menor.",
    "Aparelho": "Polia ou Halter",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Supino Reto",
    "Categoria": "Peito",
    "Grupo_Muscular": "Peitoral Maior",
    "Descricao": "Desenvolve a porção mediana do peitoral.",
    "Aparelho": "Banco e Barra",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Supino Inclinado",
    "Categoria": "Peito",
    "Grupo_Muscular": "Peitoral Superior",
    "Descricao": "Trabalha a parte superior do peitoral com maior ênfase.",
    "Aparelho": "Banco Inclinado e Barra",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Crucifixo com Halteres",
    "Categoria": "Peito",
    "Grupo_Muscular": "Peitoral",
    "Descricao": "Exercício de abertura que alonga e ativa as fibras do peito.",
    "Aparelho": "Halteres",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Peck Deck",
    "Categoria": "Peito",
    "Grupo_Muscular": "Peitoral",
    "Descricao": "Isola o peitoral maior através da adução dos braços.",
    "Aparelho": "Peck Deck",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Flexão de Braço",
    "Categoria": "Peito",
    "Grupo_Muscular": "Peitoral",
    "Descricao": "Trabalha peito, tríceps e ombros com peso corporal.",
    "Aparelho": "Peso corporal",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Crossover",
    "Categoria": "Peito",
    "Grupo_Muscular": "Peitoral",
    "Descricao": "Ativa a região central do peitoral com cabos cruzados.",
    "Aparelho": "Polia Cruzada",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Rosca Direta",
    "Categoria": "Braço",
    "Grupo_Muscular": "Bíceps",
    "Descricao": "Fortalece a parte frontal do braço com movimento de flexão.",
    "Aparelho": "Barra ou Halteres",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Tríceps Testa",
    "Categoria": "Braço",
    "Grupo_Muscular": "Tríceps",
    "Descricao": "Exercício que foca na cabeça longa do tríceps.",
    "Aparelho": "Barra W ou Halteres",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Rosca Alternada",
    "Categoria": "Braço",
    "Grupo_Muscular": "Bíceps",
    "Descricao": "Trabalha cada bíceps de forma alternada para maior concentração.",
    "Aparelho": "Halteres",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Tríceps Corda",
    "Categoria": "Braço",
    "Grupo_Muscular": "Tríceps",
    "Descricao": "Fortalece o tríceps com movimento de extensão na polia.",
    "Aparelho": "Polia com Corda",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Rosca Martelo",
    "Categoria": "Braço",
    "Grupo_Muscular": "Braquial",
    "Descricao": "Exercício que trabalha o músculo braquial e bíceps.",
    "Aparelho": "Halteres",
    "file": "video_exemplo.mp4"
  },
  {
    "nome": "Mergulho no Banco",
    "Categoria": "Braço",
    "Grupo_Muscular": "Tríceps",
    "Descricao": "Isola o tríceps utilizando peso corporal.",
    "Aparelho": "Banco",
    "file": "video_exemplo.mp4"
  }
];

// Função que envia um exercício por vez
async function enviarExercicio(exercicio) {
  const formData = new FormData();
  
  // Campos de texto
  formData.append("nome", exercicio.nome);
  formData.append("Categoria", exercicio.Categoria);
  formData.append("Grupo_Muscular", exercicio.Grupo_Muscular);
  formData.append("Descricao", exercicio.Descricao);
  formData.append("Aparelho", exercicio.Aparelho);
  
  // Arquivo (o mesmo para todos)
  console.log(fs.existsSync(`./${exercicio.file}`));
  formData.append("file", fs.createReadStream(`./${exercicio.file}`));

  try {
    const response = await axios.post(apiURL, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`✅ ${exercicio.nome} enviado com sucesso!`);
  } catch (error) {
    console.error(`❌ Erro ao enviar ${exercicio.nome}:`, error.response?.data || error.message);
  }
}

// Executa todos em sequência
(async () => {
  for (const exercicio of exercicios) {
    await enviarExercicio(exercicio);
  }
  console.log("🏁 Todos os exercícios foram processados!");
})();
