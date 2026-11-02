// Lista de tenis da VOLT
const itens = [
  { nome: "VOLT Cyborg 2", preco: 899.9, estoque: 12 },
  { nome: "VOLT Ikill 4", preco: 749.9, estoque: 3 },
  { nome: "VOLT Amp 3", preco: 629.9, estoque: 0 },
  { nome: "VOLT Surge 01", preco: 1199.9, estoque: 4 },
  { nome: "VOLT Pulse Pro", preco: 959.9, estoque: 20 },
  { nome: "VOLT Aero X", preco: 689.9, estoque: 7 }
];

// Calcula o valor total em estoque sem mexer no item original (desconto padrao = 0)
function calcularValorTotalEstoque(item, taxaDesconto = 0) {
  const precoComDesconto = item.preco * (1 - taxaDesconto);
  return Number((precoComDesconto * item.estoque).toFixed(2));
}

// Define o status e a classe visual conforme a quantidade
function classificarDisponibilidade(quantidade) {
  if (quantidade === 0) {
    return {
      rotulo: "Esgotado",
      classe: "status-esgotado"
    };
  }

  if (quantidade <= 5) {
    return {
      rotulo: "Últimas Unidades",
      classe: "status-ultimas-unidades"
    };
  }

  return {
    rotulo: "Em Estoque",
    classe: "status-disponivel"
  };
}

// 1. .map() para gerar a lista tratada com os calculos e rotulos
const itensProcessados = itens.map(function (item) {
  const valorTotal = calcularValorTotalEstoque(item);
  const status = classificarDisponibilidade(item.estoque);

  return {
    nome: item.nome,
    preco: item.preco,
    estoque: item.estoque,
    valorTotalEstoque: valorTotal,
    statusRotulo: status.rotulo,
    statusClasse: status.classe
  };
});

// 2. .filter() para pegar so o que ainda temos para vender
const itensDisponiveis = itensProcessados.filter(function (item) {
  return item.estoque > 0;
});

// 3. .reduce() para somar o patrimonio e total de pares do estoque
const resumoInventario = itensProcessados.reduce(
  function (acumulador, itemAtual) {
    return {
      patrimonioTotal: acumulador.patrimonioTotal + itemAtual.valorTotalEstoque,
      totalPares: acumulador.totalPares + itemAtual.estoque
    };
  },
  { patrimonioTotal: 0, totalPares: 0 }
);

// Monta e renderiza os elementos na tela de forma segura
function renderizarCatalogoEDOM() {
  const containerResultado = document.querySelector("#resultado");

  // Garante que o elemento existe antes de continuar
  if (!containerResultado) {
    console.error("Elemento <section id='resultado'> não encontrado.");
    return;
  }

  // Titulo e subtitulo da secao
  const tituloSecao = document.createElement("h2");
  tituloSecao.textContent = "⚡ Catálogo & Estoque VOLT";
  tituloSecao.classList.add("resultado-titulo");

  const subtituloSecao = document.createElement("p");
  subtituloSecao.textContent =
    "Listagem gerada dinamicamente via JavaScript.";
  subtituloSecao.classList.add("resultado-subtitulo");

  containerResultado.append(tituloSecao, subtituloSecao);

  // Grade para os cards
  const gridCards = document.createElement("div");
  gridCards.classList.add("resultado-grid");

  // Cria cada card usando apenas createElement e textContent (sem innerHTML)
  itensProcessados.forEach(function (tenis) {
    const card = document.createElement("article");
    card.classList.add("resultado-card");

    const titulo = document.createElement("h3");
    titulo.textContent = tenis.nome;
    titulo.classList.add("resultado-card-nome");

    const preco = document.createElement("p");
    preco.textContent = `Preço: R$ ${tenis.preco.toFixed(2)}`;
    preco.classList.add("resultado-card-info");

    const estoque = document.createElement("p");
    estoque.textContent = `Estoque: ${tenis.estoque} pares`;
    estoque.classList.add("resultado-card-info");

    const total = document.createElement("p");
    total.textContent = `Total em Estoque: R$ ${tenis.valorTotalEstoque.toFixed(2)}`;
    total.classList.add("resultado-card-destaque");

    // Etiqueta com classe dinamica de status
    const badgeStatus = document.createElement("span");
    badgeStatus.textContent = tenis.statusRotulo;
    badgeStatus.classList.add("resultado-badge", tenis.statusClasse);

    card.append(titulo, preco, estoque, total, badgeStatus);
    gridCards.append(card);
  });

  // Caixa de resumo final vinda do .reduce()
  const painelResumo = document.createElement("aside");
  painelResumo.classList.add("resultado-resumo");

  const tituloResumo = document.createElement("h4");
  tituloResumo.textContent = "📊 Resumo Geral do Estoque";
  tituloResumo.classList.add("resultado-resumo-titulo");

  const textoPares = document.createElement("p");
  textoPares.textContent = `Pares disponíveis: ${resumoInventario.totalPares} un. (Modelos ativos: ${itensDisponiveis.length} de ${itensProcessados.length})`;

  const textoValorTotal = document.createElement("p");
  textoValorTotal.textContent = `Valor total do estoque: R$ ${resumoInventario.patrimonioTotal.toFixed(2)}`;

  painelResumo.append(tituloResumo, textoPares, textoValorTotal);

  // Adiciona tudo na secao do HTML
  containerResultado.append(gridCards, painelResumo);
}

// Dispara a montagem na tela
renderizarCatalogoEDOM();
