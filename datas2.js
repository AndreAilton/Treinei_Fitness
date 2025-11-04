import axios from "axios";

// URL e token
const apiURL = "http://localhost:4000/treinos-dias";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJUcmVpbmFkb3JAZ21haWwuY29tIiwidGlwbyI6InRyZWluYWRvciIsImlhdCI6MTc2MjIyODIyOCwiZXhwIjoxNzY0ODIwMjI4fQ.txZ1LoziNJ9UxrwBOtC5ONu6L7FOHVQ6xP84SJAJOLM";

// JSON com os dados dos treinos por dia
const treinosDias = [
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Segunda-feira",
    "id_Exercicio": 1,
    "Series": 4,
    "Repeticoes": 12,
    "Descanso": 60,
    "Observacoes": "Executar com carga moderada"
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Segunda-feira",
    "id_Exercicio": 2,
    "Series": 4,
    "Repeticoes": 10,
    "Descanso": 90,
    "Observacoes": ""
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Segunda-feira",
    "id_Exercicio": 3,
    "Series": 3,
    "Repeticoes": 15,
    "Descanso": 60,
    "Observacoes": "Controlar a descida"
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Segunda-feira",
    "id_Exercicio": 4,
    "Series": 4,
    "Repeticoes": 12,
    "Descanso": 60,
    "Observacoes": ""
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Segunda-feira",
    "id_Exercicio": 5,
    "Series": 3,
    "Repeticoes": 10,
    "Descanso": 90,
    "Observacoes": "Mantenha o tronco firme"
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Segunda-feira",
    "id_Exercicio": 6,
    "Series": 4,
    "Repeticoes": 15,
    "Descanso": 45,
    "Observacoes": ""
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Terça-feira",
    "id_Exercicio": 7,
    "Series": 4,
    "Repeticoes": 12,
    "Descanso": 60,
    "Observacoes": "Puxar com o dorso, não com os braços"
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Terça-feira",
    "id_Exercicio": 8,
    "Series": 4,
    "Repeticoes": 10,
    "Descanso": 90,
    "Observacoes": ""
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Terça-feira",
    "id_Exercicio": 9,
    "Series": 3,
    "Repeticoes": 12,
    "Descanso": 60,
    "Observacoes": "Manter boa postura"
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Terça-feira",
    "id_Exercicio": 10,
    "Series": 4,
    "Repeticoes": 10,
    "Descanso": 90,
    "Observacoes": ""
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Terça-feira",
    "id_Exercicio": 11,
    "Series": 4,
    "Repeticoes": 8,
    "Descanso": 120,
    "Observacoes": "Usar carga pesada"
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Terça-feira",
    "id_Exercicio": 12,
    "Series": 3,
    "Repeticoes": 12,
    "Descanso": 60,
    "Observacoes": ""
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Quarta-feira",
    "id_Exercicio": 13,
    "Series": 4,
    "Repeticoes": 10,
    "Descanso": 90,
    "Observacoes": "Alongar o peitoral antes"
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Quarta-feira",
    "id_Exercicio": 14,
    "Series": 4,
    "Repeticoes": 12,
    "Descanso": 60,
    "Observacoes": ""
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Quarta-feira",
    "id_Exercicio": 15,
    "Series": 3,
    "Repeticoes": 15,
    "Descanso": 45,
    "Observacoes": "Evitar esticar demais o braço"
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Quarta-feira",
    "id_Exercicio": 16,
    "Series": 4,
    "Repeticoes": 12,
    "Descanso": 60,
    "Observacoes": ""
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Quarta-feira",
    "id_Exercicio": 17,
    "Series": 3,
    "Repeticoes": 20,
    "Descanso": 45,
    "Observacoes": "Fazer até a falha técnica"
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Quarta-feira",
    "id_Exercicio": 18,
    "Series": 4,
    "Repeticoes": 12,
    "Descanso": 60,
    "Observacoes": ""
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Quinta-feira",
    "id_Exercicio": 19,
    "Series": 4,
    "Repeticoes": 10,
    "Descanso": 60,
    "Observacoes": "Manter cotovelos fixos"
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Quinta-feira",
    "id_Exercicio": 20,
    "Series": 4,
    "Repeticoes": 12,
    "Descanso": 75,
    "Observacoes": ""
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Quinta-feira",
    "id_Exercicio": 21,
    "Series": 3,
    "Repeticoes": 15,
    "Descanso": 45,
    "Observacoes": "Concentrar no bíceps"
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Quinta-feira",
    "id_Exercicio": 22,
    "Series": 4,
    "Repeticoes": 12,
    "Descanso": 60,
    "Observacoes": ""
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Quinta-feira",
    "id_Exercicio": 23,
    "Series": 3,
    "Repeticoes": 12,
    "Descanso": 45,
    "Observacoes": ""
  },
  {
    "id_Treino": 1,
    "Dia_da_Semana": "Quinta-feira",
    "id_Exercicio": 24,
    "Series": 4,
    "Repeticoes": 15,
    "Descanso": 60,
    "Observacoes": "Focar na contração do tríceps"
  }
]
;

// Função para enviar um treino
async function enviarTreinoDia(treino) {
  try {
    const response = await axios.post(apiURL, treino, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`✅ Treino enviado (${treino.Dia_da_Semana} - Exercício ${treino.id_Exercicio})`);
  } catch (error) {
    console.error(`❌ Erro ao enviar treino ${treino.id_Exercicio}:`, error.response?.data || error.message);
  }
}

// Enviar todos os treinos sequencialmente
(async () => {
  for (const treino of treinosDias) {
    await enviarTreinoDia(treino);
  }
  console.log("🏁 Todos os treinos foram enviados!");
})();
