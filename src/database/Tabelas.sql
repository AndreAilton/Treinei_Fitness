
USE fitness_app;

INSERT INTO Treinador (nome, email, password_hash, created_at, updated_at) VALUES
('Carlos Henrique', 'carlos.henrique@example.com', '$2b$10$abcd1234hashedsenha1', NOW(), NOW()),
('Ana Souza', 'ana.souza@example.com', '$2b$10$abcd1234hashedsenha2', NOW(), NOW()),
('Juliano Ramos', 'juliano.ramos@example.com', '$2b$10$abcd1234hashedsenha3', NOW(), NOW()),
('Mariana Alves', 'mariana.alves@example.com', '$2b$10$abcd1234hashedsenha4', NOW(), NOW()),
('Rafael Lima', 'rafael.lima@example.com', '$2b$10$abcd1234hashedsenha5', NOW(), NOW());


INSERT INTO Exercicios (nome, Categoria, Grupo_Muscular, Descrição, Aperelho, id_treinador, created_at, updated_at) VALUES
('Supino Reto', 'Força', 'Peitoral', 'Exercício clássico para desenvolver o peitoral maior.', 'Banco e barra', 1, NOW(), NOW()),
('Agachamento Livre', 'Força', 'Pernas', 'Fortalece glúteos, quadríceps e posterior.', 'Barra olímpica', 2, NOW(), NOW()),
('Remada Curvada', 'Força', 'Costas', 'Trabalha dorsais e romboides.', 'Barra', 3, NOW(), NOW()),
('Desenvolvimento com Halteres', 'Hipertrofia', 'Ombros', 'Foca no deltoide anterior e lateral.', 'Halteres', 4, NOW(), NOW()),
('Rosca Direta', 'Hipertrofia', 'Bíceps', 'Isola o músculo bíceps braquial.', 'Barra W', 5, NOW(), NOW()),
('Tríceps Pulley', 'Resistência', 'Tríceps', 'Trabalha todas as cabeças do tríceps.', 'Máquina de pulley', 1, NOW(), NOW()),
('Flexão de Braço', 'Resistência', 'Peitoral', 'Exercício com peso corporal para peitoral, tríceps e ombro.', NULL, 2, NOW(), NOW()),
('Elevação Lateral', 'Isolamento', 'Ombros', 'Exercício para deltoide lateral.', 'Halteres', 3, NOW(), NOW());


INSERT INTO Treinos (nome, id_treinador, created_at, updated_at) VALUES
('Treino A - Peito e Tríceps', 1, NOW(), NOW()),
('Treino B - Costas e Bíceps', 2, NOW(), NOW()),
('Treino C - Pernas', 3, NOW(), NOW()),
('Treino D - Ombro e Abdômen', 4, NOW(), NOW()),
('Treino E - Corpo inteiro', 5, NOW(), NOW()),
('Treino F - Resistência e Cardio', 1, NOW(), NOW()),
('Treino G - Força Máxima', 2, NOW(), NOW());


INSERT INTO TreinoDia (
  id_Treino, Dia_da_Semana, id_Exercicio,
  Series, Repeticoes, Descanso, Observacoes,
  created_at, updated_at
) VALUES
-- Treino A - Segunda-feira
(1, 'Segunda-feira', 1, 4, 10, 60, 'Aumentar carga gradualmente', NOW(), NOW()),
(1, 'Segunda-feira', 5, 3, 12, 45, NULL, NOW(), NOW()),

-- Treino B - Terça-feira
(2, 'Terça-feira', 3, 4, 8, 90, 'Manter postura correta', NOW(), NOW()),
(2, 'Terça-feira', 4, 3, 10, 60, NULL, NOW(), NOW()),

-- Treino C - Quarta-feira
(3, 'Quarta-feira', 2, 5, 6, 120, 'Focar na profundidade do agachamento', NOW(), NOW()),

-- Treino D - Quinta-feira
(4, 'Quinta-feira', 8, 4, 12, 45, 'Usar carga leve', NOW(), NOW()),

-- Treino E - Sexta-feira
(5, 'Sexta-feira', 6, 3, 15, 30, NULL, NOW(), NOW()),

-- Treino G - Domingo
(7, 'Domingo', 7, 4, 20, 30, 'Exercício com peso corporal', NOW(), NOW());


INSERT INTO Usuarios (nome, email, password_hash, created_at, updated_at) VALUES
('João Silva', 'joao.silva@example.com', '$2b$10$hashedsenha1', NOW(), NOW()),
('Laura Mendes', 'laura.mendes@example.com', '$2b$10$hashedsenha2', NOW(), NOW()),
('Paulo Oliveira', 'paulo.oliveira@example.com', '$2b$10$hashedsenha3', NOW(), NOW()),
('Beatriz Costa', 'beatriz.costa@example.com', '$2b$10$hashedsenha4', NOW(), NOW()),
('Felipe Rocha', 'felipe.rocha@example.com', '$2b$10$hashedsenha5', NOW(), NOW());


INSERT INTO UsuariosTreino (id_Usuario, id_Treino, ativo, created_at, updated_at) VALUES
(1, 1, true, NOW(), NOW()),
(2, 2, true, NOW(), NOW()),
(3, 3, true, NOW(), NOW()),
(4, 5, false, NOW(), NOW()),
(5, 4, true, NOW(), NOW()),
(1, 6, false, NOW(), NOW()),
(2, 7, true, NOW(), NOW());


-- Segunda-feira: Peito
INSERT INTO TreinoDia (id_Treino, Dia_da_Semana, id_Exercicio, Series, Repeticoes, Descanso, Observacoes, created_at, updated_at)
VALUES 
(1, 'Segunda-feira', 1, 4, 10, 60, 'Supino reto com carga moderada', NOW(), NOW()),
(1, 'Segunda-feira', 5, 3, 12, 45, 'Finalizar com rosca direta leve', NOW(), NOW());

-- Terça-feira: Costas
INSERT INTO TreinoDia (id_Treino, Dia_da_Semana, id_Exercicio, Series, Repeticoes, Descanso, Observacoes, created_at, updated_at)
VALUES 
(1, 'Terça-feira', 3, 4, 8, 90, NULL, NOW(), NOW()),
(1, 'Terça-feira', 4, 3, 10, 60, 'Manter execução controlada', NOW(), NOW());

-- Quarta-feira: Pernas
INSERT INTO TreinoDia (id_Treino, Dia_da_Semana, id_Exercicio, Series, Repeticoes, Descanso, Observacoes, created_at, updated_at)
VALUES 
(1, 'Quarta-feira', 2, 5, 6, 120, 'Agachamento profundo', NOW(), NOW());

-- Quinta-feira: Ombros
INSERT INTO TreinoDia (id_Treino, Dia_da_Semana, id_Exercicio, Series, Repeticoes, Descanso, Observacoes, created_at, updated_at)
VALUES 
(1, 'Quinta-feira', 8, 4, 12, 45, 'Elevação lateral com pausa de 1s', NOW(), NOW());

-- Sexta-feira: Tríceps
INSERT INTO TreinoDia (id_Treino, Dia_da_Semana, id_Exercicio, Series, Repeticoes, Descanso, Observacoes, created_at, updated_at)
VALUES 
(1, 'Sexta-feira', 6, 3, 15, 30, 'Pulley com pegada fechada', NOW(), NOW());

-- Sábado: Cardio ou peso corporal
INSERT INTO TreinoDia (id_Treino, Dia_da_Semana, id_Exercicio, Series, Repeticoes, Descanso, Observacoes, created_at, updated_at)
VALUES 
(1, 'Sábado', 7, 4, 20, 30, 'Flexões com pausa a cada 10 repetições', NOW(), NOW());

-- Domingo: Livre ou recuperação ativa
-- (opcional, mas incluído para exemplo completo)
INSERT INTO TreinoDia (id_Treino, Dia_da_Semana, id_Exercicio, Series, Repeticoes, Descanso, Observacoes, created_at, updated_at)
VALUES 
(1, 'Domingo', 7, 3, 15, 45, 'Alongamento + flexões leves', NOW(), NOW());


SELECT 
  u.nome AS usuario_nome,
  t.nome AS treino_nome,
  td.Dia_da_Semana,
  
  e.nome AS exercicio_nome,
  e.Categoria,
  e.Grupo_Muscular,
  e.Descrição,
  e.Aperelho,

  td.Series,
  td.Repeticoes,
  td.Descanso,
  td.Observacoes

FROM Usuarios u

JOIN UsuariosTreino ut ON ut.id_Usuario = u.id
JOIN Treinos t ON t.id = ut.id_Treino
JOIN TreinoDia td ON td.id_Treino = t.id
JOIN Exercicios e ON e.id = td.id_Exercicio

WHERE u.id = 1
  AND ut.ativo = true -- considera apenas treinos ativos

ORDER BY 
  FIELD(td.Dia_da_Semana, 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'),
  td.Dia_da_Semana,
  e.nome;
