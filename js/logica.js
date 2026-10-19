/*
 * ============================================================================
 * PROJETO INTEGRADOR — VOLT (Tênis Esportivos de Alta Performance)
 * Aula 09: Mini-Analisador de Dados em JavaScript Puro (js/logica.js)
 * ============================================================================
 *
 * 1. PLANEJAMENTO (Tema, Entrada, Processamento, Saída e Pseudocódigo)
 * ----------------------------------------------------------------------------
 * - Tema: Catálogo e controle de estoque de tênis esportivos da marca VOLT.
 * - Entrada:
 *   1) Um limite numérico (via prompt) que define a quantidade máxima para
 *      classificar o estoque de um modelo como "Baixo" (entre 1 e 50).
 *   2) Comandos de consulta rápida (via prompt em laço while) pelo nome da
 *      categoria ("corrida", "treino", "urbano", "edicao-limitada") até o
 *      usuário digitar "sair".
 * - Processamento:
 *   1) Validar e converter a entrada numérica com Number(), tratando null,
 *      string vazia, NaN e valores fora da faixa permitida (1 a 50).
 *   2) Percorrer o catálogo de tênis classificando o nível de estoque com
 *      if / else if / else ("Esgotado", "Baixo", "Normal", "Elevado") e
 *      mapeando a seção da loja com switch sobre a propriedade categoria.
 *   3) Calcular indicadores com acumuladores, contadores, máximo e média
 *      (unidades totais, valor financeiro do estoque, itens críticos, modelo
 *      mais caro e preço médio).
 * - Saída esperada:
 *   Relatório detalhado no Console com frases em template literal, tabela
 *   estruturada via console.table() e resultado das consultas do laço while.
 *
 * - Pseudocódigo (7 linhas):
 *   1. DECLARAR constante catalogoTenisVolt com 6 modelos (nome, preco, estoque, categoria)
 *   2. LER limiteDigitado via prompt, converter com Number() e validar null, vazio, NaN e faixa [1..50]
 *   3. INICIALIZAR acumuladores (valorTotalEstoque, unidadesTotais, somaPrecos), contadores e modeloMaisCaro
 *   4. PARA CADA modelo do catalogoTenisVolt: classificar estoque (if/else if/else) e definir secaoLoja (switch)
 *   5. ATUALIZAR no laço os contadores, somadores e verificar se o preco atual supera o modeloMaisCaro
 *   6. EXIBIR tabela com console.table(relatorioCatalogo) e resumo formatado com template literals
 *   7. ENQUANTO comando do usuário for diferente de "sair", ler categoria via prompt e exibir modelos filtrados
 * ============================================================================
 */

// 2. DECLARAÇÃO DOS DADOS (const, camelCase, sem acentos nos identificadores)
const catalogoTenisVolt = [
  {
    nome: "VOLT Cyborg 2",
    preco: 899.9,
    estoque: 12,
    categoria: "corrida"
  },
  {
    nome: "VOLT Ikill 4",
    preco: 749.9,
    estoque: 3,
    categoria: "treino"
  },
  {
    nome: "VOLT Amp 3",
    preco: 629.9,
    estoque: 0,
    categoria: "urbano"
  },
  {
    nome: "VOLT Surge 01",
    preco: 1199.9,
    estoque: 4,
    categoria: "edicao-limitada"
  },
  {
    nome: "VOLT Pulse Pro",
    preco: 959.9,
    estoque: 22,
    categoria: "corrida"
  },
  {
    nome: "VOLT Aero X",
    preco: 689.9,
    estoque: 9,
    categoria: "treino"
  }
];

// 3. ENTRADA COM PROMPT, CONVERSÃO COM Number() E VALIDAÇÃO COMPLETA (Evita Erro 2)
const limitePadraoEstoqueBaixo = 5;
const entradaLimiteBruta = prompt(
  "⚡ VOLT Analisador de Estoque\nInforme o limite de unidades para considerar 'Estoque Baixo' (número entre 1 e 50):",
  String(limitePadraoEstoqueBaixo)
);

let limiteEstoqueBaixo = limitePadraoEstoqueBaixo;

if (entradaLimiteBruta === null) {
  console.warn(
    `[Aviso] Entrada cancelada pelo usuário. Aplicando limite padrão: ${limitePadraoEstoqueBaixo} unidades.`
  );
} else if (entradaLimiteBruta.trim() === "") {
  console.warn(
    `[Aviso] Entrada vazia. Aplicando limite padrão: ${limitePadraoEstoqueBaixo} unidades.`
  );
} else {
  const numeroConvertido = Number(entradaLimiteBruta.trim());

  if (Number.isNaN(numeroConvertido)) {
    console.warn(
      `[Aviso] Valor "${entradaLimiteBruta}" não é numérico (NaN). Aplicando limite padrão: ${limitePadraoEstoqueBaixo} unidades.`
    );
  } else if (numeroConvertido < 1 || numeroConvertido > 50) {
    console.warn(
      `[Aviso] Valor ${numeroConvertido} fora da faixa permitida (1 a 50). Aplicando limite padrão: ${limitePadraoEstoqueBaixo} unidades.`
    );
  } else {
    limiteEstoqueBaixo = Math.floor(numeroConvertido);
  }
}

// 4, 5 e 6. CLASSIFICAÇÃO (if/else if/else + switch) E RESUMO COM LAÇO
let unidadesTotais = 0;
let valorTotalEstoque = 0;
let somaPrecosCatalogo = 0;
let quantidadeEsgotados = 0;
let quantidadeEstoqueBaixo = 0;
let quantidadeCriticos = 0;
let modeloMaisCaro = catalogoTenisVolt[0];

const relatorioCatalogo = [];

// Uso de for com limite estrito (< catalogoTenisVolt.length) evitando Erro 3 (off-by-one)
for (let i = 0; i < catalogoTenisVolt.length; i++) {
  const modelo = catalogoTenisVolt[i];

  // Passo 4: Classificação em 4 faixas com if / else if / else na ordem correta e usando === (Evita Erro 1)
  let statusEstoque = "";
  if (modelo.estoque === 0) {
    statusEstoque = "Esgotado";
    quantidadeEsgotados++;
    quantidadeCriticos++;
  } else if (modelo.estoque < limiteEstoqueBaixo) {
    statusEstoque = "Baixo";
    quantidadeEstoqueBaixo++;
    quantidadeCriticos++;
  } else if (modelo.estoque <= 15) {
    statusEstoque = "Normal";
  } else {
    statusEstoque = "Elevado";
  }

  // Passo 5: switch sobre propriedade de texto (categoria) com break em todos os cases e default (Evita Erro 5)
  let secaoLoja = "";
  switch (modelo.categoria) {
    case "corrida":
      secaoLoja = "Corredor Pro — Pista & Maratona";
      break;
    case "treino":
      secaoLoja = "Studio Force — Cross & Funcional";
      break;
    case "urbano":
      secaoLoja = "Street Lab — Casual & Urbano";
      break;
    case "edicao-limitada":
      secaoLoja = "Vault Drop — Colecionadores";
      break;
    default:
      secaoLoja = "Seção Geral VOLT";
      break;
  }

  // Passo 6: Padrões de acumulador e máximo/mínimo
  const subtotalModelo = modelo.preco * modelo.estoque;
  unidadesTotais += modelo.estoque;
  valorTotalEstoque += subtotalModelo;
  somaPrecosCatalogo += modelo.preco;

  if (modelo.preco > modeloMaisCaro.preco) {
    modeloMaisCaro = modelo;
  }

  relatorioCatalogo.push({
    indice: i,
    modelo: modelo.nome,
    categoria: modelo.categoria,
    secaoLoja: secaoLoja,
    precoUnitario: Number(modelo.preco.toFixed(2)),
    estoque: modelo.estoque,
    statusEstoque: statusEstoque,
    valorEmEstoque: Number(subtotalModelo.toFixed(2))
  });
}

const precoMedioCatalogo = somaPrecosCatalogo / catalogoTenisVolt.length;

/*
 * ============================================================================
 * 9. TESTE DE MESA — 3 PRIMEIRAS VOLTAS DO LAÇO PRINCIPAL (limiteEstoqueBaixo = 5)
 * ============================================================================
 * | Volta (i) | modelo.nome   | estoque | statusEstoque | categoria | subtotalModelo | valorTotalEstoque | unidadesTotais | quantidadeCriticos | modeloMaisCaro.nome |
 * |-----------|---------------|---------|---------------|-----------|----------------|-------------------|----------------|--------------------|---------------------|
 * | 0         | VOLT Cyborg 2 | 12      | "Normal"      | "corrida" | 10798.80       | 10798.80          | 12             | 0                  | "VOLT Cyborg 2"     |
 * | 1         | VOLT Ikill 4  | 3       | "Baixo"       | "treino"  | 2249.70        | 13048.50          | 15             | 1                  | "VOLT Cyborg 2"     |
 * | 2         | VOLT Amp 3    | 0       | "Esgotado"    | "urbano"  | 0.00           | 13048.50          | 15             | 2                  | "VOLT Cyborg 2"     |
 * ============================================================================
 */

// 8. EXIBIÇÃO DO RESULTADO COM TEMPLATE LITERAL E CONSOLE.TABLE
console.log("==============================================================");
console.log(`⚡ RELATÓRIO DE ESTOQUE E CATÁLOGO — VOLT`);
console.log(`Parâmetro aplicado para Estoque Baixo: menos de ${limiteEstoqueBaixo} unidades`);
console.log("==============================================================");

console.table(relatorioCatalogo);

console.log(
  `📦 Total de modelos analisados: ${catalogoTenisVolt.length} modelos (${unidadesTotais} pares em estoque)`
);
console.log(
  `💰 Valor financeiro total em estoque: R$ ${valorTotalEstoque.toFixed(2)}`
);
console.log(
  `📊 Preço médio dos tênis do catálogo: R$ ${precoMedioCatalogo.toFixed(2)}`
);
console.log(
  `🏆 Modelo mais caro da coleção: ${modeloMaisCaro.nome} (R$ ${modeloMaisCaro.preco.toFixed(2)})`
);
console.log(
  `⚠️ Alerta de reposição: ${quantidadeCriticos} modelo(s) em estado crítico (${quantidadeEsgotados} esgotado(s) e ${quantidadeEstoqueBaixo} com estoque baixo)`
);

// 7. LAÇO WHILE COM ATUALIZAÇÃO DA CONDIÇÃO DE SAÍDA DENTRO DO BLOCO (Evita Erro 4)
let comandoConsulta = prompt(
  "🔍 Consulta Rápida VOLT\nDigite uma categoria para listar os modelos ('corrida', 'treino', 'urbano', 'edicao-limitada') ou digite 'sair' para encerrar:",
  "sair"
);

while (comandoConsulta !== null && comandoConsulta.trim().toLowerCase() !== "sair") {
  const categoriaBuscada = comandoConsulta.trim().toLowerCase();
  let encontradosNaCategoria = 0;

  console.log(`\n🔎 Resultado da busca pela categoria "${categoriaBuscada}":`);

  for (const item of catalogoTenisVolt) {
    if (item.categoria === categoriaBuscada) {
      encontradosNaCategoria++;
      console.log(
        `  • ${item.nome} — R$ ${item.preco.toFixed(2)} (${item.estoque} un. em estoque)`
      );
    }
  }

  if (encontradosNaCategoria === 0) {
    console.log(
      `  Nenhum modelo encontrado para "${categoriaBuscada}". Categorias válidas: corrida, treino, urbano, edicao-limitada.`
    );
  }

  // Atualização obrigatória da variável de controle dentro do while (evita loop infinito)
  comandoConsulta = prompt(
    "🔍 Digite outra categoria ('corrida', 'treino', 'urbano', 'edicao-limitada') ou 'sair' para finalizar:",
    "sair"
  );
}

console.log("✅ Análise do catálogo VOLT finalizada com sucesso.");
