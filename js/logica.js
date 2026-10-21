// Catálogo de tênis
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

// Limite para estoque baixo
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

// Processamento e totais
let unidadesTotais = 0;
let valorTotalEstoque = 0;
let somaPrecosCatalogo = 0;
let quantidadeEsgotados = 0;
let quantidadeEstoqueBaixo = 0;
let quantidadeCriticos = 0;
let modeloMaisCaro = catalogoTenisVolt[0];

const relatorioCatalogo = [];

for (let i = 0; i < catalogoTenisVolt.length; i++) {
  const modelo = catalogoTenisVolt[i];

  // Status do estoque
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

  // Setor da loja
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

  // Acumuladores e destaque
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

// Exibição dos resultados
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

// Consulta por categoria
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

  comandoConsulta = prompt(
    "🔍 Digite outra categoria ('corrida', 'treino', 'urbano', 'edicao-limitada') ou 'sair' para finalizar:",
    "sair"
  );
}

console.log("✅ Análise do catálogo VOLT finalizada com sucesso.");
