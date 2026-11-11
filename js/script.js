/**
 * ============================================================================
 * PROJETO INTEGRADOR — VOLT (AULA 12)
 * Arquitetura de DOM Seguro, Estado Acessível, Filtros e Delegação de Eventos
 * ============================================================================
 */

// ============================================================================
// 1. FONTE DE VERDADE (Single Source of Truth)
// Array imutável declarado no topo com mais de 5 objetos do tema esportivo VOLT,
// contendo propriedades ricas (> 3) e identificador único ("id").
// Toda a interface é desenhada a partir desta fonte de dados.
// ============================================================================
const CATALOGO_PRODUTOS_VOLT = [
  {
    id: "volt-cyborg-2",
    nome: "VOLT Cyborg 2",
    categoria: "corrida",
    preco: 899.9,
    estoque: 12,
    descricao: "Propulsão por placa de carbono e entressola em nitrogênio injetado para alto rendimento.",
    imagem: "images/tenis/VOLT Cyborb 2/front.png",
    emDestaque: true
  },
  {
    id: "volt-ikill-4",
    nome: "VOLT Ikill 4",
    categoria: "treino",
    preco: 749.9,
    estoque: 3,
    descricao: "Grip reforçado com suporte lateral em TPU para treinos funcionais e alta intensidade.",
    imagem: "images/tenis/VOLT Ikill 4/front.png",
    emDestaque: false
  },
  {
    id: "volt-amp-3",
    nome: "VOLT Amp 3",
    categoria: "urbano",
    preco: 629.9,
    estoque: 0,
    descricao: "Design minimalista e cabedal em malha técnica respirável para máximo conforto cotidiano.",
    imagem: "images/tenis/VOLT Amp 3/front.png",
    emDestaque: false
  },
  {
    id: "volt-surge-01",
    nome: "VOLT Surge 01",
    categoria: "corrida",
    preco: 1199.9,
    estoque: 4,
    descricao: "Edição de elite para maratonistas com retorno contínuo de energia a cada passada.",
    imagem: "images/tenis/VOLT Surge 01/front.png",
    emDestaque: true
  },
  {
    id: "volt-pulse-pro",
    nome: "VOLT Pulse Pro",
    categoria: "treino",
    preco: 959.9,
    estoque: 18,
    descricao: "Base ampla estabilizadora e amortecimento duplo contra impactos pesados.",
    imagem: "images/tenis/VOLT Cyborb 2/front.png",
    emDestaque: false
  },
  {
    id: "volt-aero-x",
    nome: "VOLT Aero X",
    categoria: "urbano",
    preco: 689.9,
    estoque: 7,
    descricao: "Silhueta aerodinâmica urbana com palmilha viscoelástica antibacteriana ultra macia.",
    imagem: "images/tenis/VOLT Ikill 4/front.png",
    emDestaque: false
  }
];

// ============================================================================
// ESTADO DA APLICAÇÃO (Single State Store)
// Mantém os filtros ativos, conjunto de IDs favoritados e controle de acessibilidade
// ============================================================================
const estadoApp = {
  filtroTexto: "",
  filtroCategoria: "todos",
  favoritos: new Set(),
  painelMetricasAberto: false,
  ultimoElementoFocado: null
};

// ============================================================================
// MAPEAMENTO DEFENSIVO DE ELEMENTOS DO DOM
// ============================================================================
const dom = {
  listaCatalogo: document.querySelector("#catalogo-lista"),
  linhaResumo: document.querySelector("#linha-resumo"),
  campoBusca: document.querySelector("#campo-busca"),
  filtroCategoria: document.querySelector("#filtro-categoria"),
  btnTogglePainel: document.querySelector("#btn-toggle-painel"),
  btnFecharPainel: document.querySelector("#btn-fechar-painel"),
  painelMetricas: document.querySelector("#painel-estatisticas"),
  metricaPatrimonio: document.querySelector("#metrica-patrimonio"),
  metricaPares: document.querySelector("#metrica-pares"),
  metricaMedia: document.querySelector("#metrica-media"),
  metricaCriticos: document.querySelector("#metrica-criticos")
};

// ============================================================================
// FUNÇÕES AUXILIARES PURAS
// ============================================================================
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function obterRotuloCategoria(categoria) {
  const categorias = {
    corrida: "Corrida & Performance",
    treino: "Treino & Cross",
    urbano: "Lifestyle & Urbano"
  };
  return categorias[categoria] || "Geral";
}

function classificarDisponibilidade(quantidadeEstoque) {
  if (quantidadeEstoque === 0) {
    return { rotulo: "Esgotado", classe: "status-esgotado" };
  }
  if (quantidadeEstoque <= 5) {
    return { rotulo: "Últimas Unidades", classe: "status-ultimas-unidades" };
  }
  return { rotulo: "Em Estoque", classe: "status-disponivel" };
}

// ============================================================================
// 2. CRIAÇÃO SEGURA DO DOM (document.createElement, textContent e dataset)
// É estritamente proibido o uso de innerHTML com dados de usuário/produtos.
// Toda árvore é instanciada e configurada via APIs nativas e seguras de DOM.
// ============================================================================
function criarCardProduto(produto) {
  // Artigo semântico que representa o card do produto
  const card = document.createElement("article");
  card.classList.add("resultado-card");
  card.dataset.id = produto.id;
  card.dataset.categoria = produto.categoria;
  card.dataset.estoque = String(produto.estoque);

  // 1. Container visual da imagem
  const fotoContainer = document.createElement("div");
  fotoContainer.classList.add("card-imagem-container");

  const imagem = document.createElement("img");
  imagem.src = produto.imagem;
  imagem.alt = `Tênis esportivo ${produto.nome}`;
  imagem.classList.add("card-imagem");
  imagem.loading = "lazy";
  fotoContainer.append(imagem);

  if (produto.emDestaque) {
    const badgeDestaque = document.createElement("span");
    badgeDestaque.classList.add("badge-destaque");
    badgeDestaque.textContent = "Destaque";
    fotoContainer.append(badgeDestaque);
  }

  // 2. Categoria e Título
  const categoriaTag = document.createElement("span");
  categoriaTag.classList.add("card-categoria-tag");
  categoriaTag.textContent = obterRotuloCategoria(produto.categoria);

  const titulo = document.createElement("h3");
  titulo.classList.add("resultado-card-nome");
  titulo.textContent = produto.nome;

  // 3. Descrição textual do calçado
  const descricao = document.createElement("p");
  descricao.classList.add("resultado-card-descricao");
  descricao.textContent = produto.descricao;

  // 4. Preço e Estoque
  const infoPreco = document.createElement("p");
  infoPreco.classList.add("resultado-card-preco");
  infoPreco.textContent = formatarMoeda(produto.preco);

  const infoEstoque = document.createElement("p");
  infoEstoque.classList.add("resultado-card-info");
  infoEstoque.textContent = `Estoque disponível: ${produto.estoque} un.`;

  // 5. Badge de status dinâmico
  const statusInfo = classificarDisponibilidade(produto.estoque);
  const badgeStatus = document.createElement("span");
  badgeStatus.classList.add("resultado-badge", statusInfo.classe);
  badgeStatus.textContent = statusInfo.rotulo;

  // 6. Barra de ações do card (botões acessíveis acionados por delegação)
  const barraAcoes = document.createElement("div");
  barraAcoes.classList.add("card-acoes");

  // Botão Favoritar: alterna aria-pressed ("true" / "false")
  const isFavorito = estadoApp.favoritos.has(produto.id);
  const btnFavoritar = document.createElement("button");
  btnFavoritar.type = "button";
  btnFavoritar.classList.add("btn-card-acao", "btn-card-fav");
  btnFavoritar.dataset.acao = "favoritar";
  btnFavoritar.dataset.id = produto.id;
  btnFavoritar.setAttribute("aria-pressed", isFavorito ? "true" : "false");
  btnFavoritar.setAttribute(
    "aria-label",
    isFavorito ? `Remover ${produto.nome} dos favoritos` : `Favoritar ${produto.nome}`
  );
  if (isFavorito) {
    btnFavoritar.classList.add("favoritado");
  }
  btnFavoritar.textContent = isFavorito ? "★ Favorito" : "☆ Favoritar";

  // Botão Detalhes: alterna aria-expanded ("true" / "false")
  const idPainelDetalhes = `detalhes-${produto.id}`;
  const btnDetalhes = document.createElement("button");
  btnDetalhes.type = "button";
  btnDetalhes.classList.add("btn-card-acao", "btn-card-detalhes");
  btnDetalhes.dataset.acao = "detalhes";
  btnDetalhes.dataset.id = produto.id;
  btnDetalhes.setAttribute("aria-expanded", "false");
  btnDetalhes.setAttribute("aria-controls", idPainelDetalhes);
  btnDetalhes.textContent = "Ver Detalhes";

  barraAcoes.append(btnFavoritar, btnDetalhes);

  // 7. Área expansível de detalhes técnicos
  const painelDetalhes = document.createElement("div");
  painelDetalhes.id = idPainelDetalhes;
  painelDetalhes.classList.add("card-detalhes-conteudo");
  painelDetalhes.hidden = true;

  const detalhesTexto = document.createElement("p");
  const subtotalEstoque = formatarMoeda(produto.preco * produto.estoque);
  detalhesTexto.textContent = `Código SKU: ${produto.id.toUpperCase()} • Valor imobilizado: ${subtotalEstoque}.`;
  painelDetalhes.append(detalhesTexto);

  // Montagem da árvore segura do card
  card.append(
    fotoContainer,
    categoriaTag,
    titulo,
    descricao,
    infoPreco,
    infoEstoque,
    badgeStatus,
    barraAcoes,
    painelDetalhes
  );

  return card;
}

// ============================================================================
// 3. FUNÇÃO DESENHAR E RESUMO COM aria-live="polite"
// Lê a fonte de verdade, filtra, limpa a lista com replaceChildren() e
// atualiza a linha de resumo com suporte a leitores de tela.
// ============================================================================
function desenhar() {
  if (!dom.listaCatalogo) {
    console.error("Contêiner #catalogo-lista não foi encontrado no DOM.");
    return;
  }

  // 1. Filtragem dos dados (busca por texto e categoria)
  const termoBusca = estadoApp.filtroTexto.trim().toLowerCase();
  const categoriaFiltro = estadoApp.filtroCategoria;

  const produtosFiltrados = CATALOGO_PRODUTOS_VOLT.filter((produto) => {
    const atendeCategoria =
      categoriaFiltro === "todos" || produto.categoria === categoriaFiltro;

    const atendeBusca =
      termoBusca === "" ||
      produto.nome.toLowerCase().includes(termoBusca) ||
      produto.descricao.toLowerCase().includes(termoBusca);

    return atendeCategoria && atendeBusca;
  });

  // 2. Atualização limpa e performática do DOM com replaceChildren()
  if (produtosFiltrados.length === 0) {
    const estadoVazio = document.createElement("div");
    estadoVazio.classList.add("catalogo-vazio");
    estadoVazio.setAttribute("role", "status");

    const iconeVazio = document.createElement("span");
    iconeVazio.classList.add("catalogo-vazio-icone");
    iconeVazio.setAttribute("aria-hidden", "true");
    iconeVazio.textContent = "🔍";

    const tituloVazio = document.createElement("h3");
    tituloVazio.classList.add("catalogo-vazio-titulo");
    tituloVazio.textContent = "Nenhum tênis encontrado";

    const textoVazio = document.createElement("p");
    textoVazio.classList.add("catalogo-vazio-texto");
    textoVazio.textContent =
      "Não encontramos nenhum modelo que corresponda aos filtros aplicados. Tente ajustar o texto ou selecionar outra categoria.";

    const botaoRedefinir = document.createElement("button");
    botaoRedefinir.type = "button";
    botaoRedefinir.classList.add("btn-limpar-busca");
    botaoRedefinir.dataset.acao = "limpar-filtros";
    botaoRedefinir.textContent = "Limpar Filtros";

    estadoVazio.append(iconeVazio, tituloVazio, textoVazio, botaoRedefinir);
    dom.listaCatalogo.replaceChildren(estadoVazio);
  } else {
    // Cria os elementos do card a partir dos dados filtrados
    const elementosCards = produtosFiltrados.map(criarCardProduto);
    dom.listaCatalogo.replaceChildren(...elementosCards);
  }

  // 3. Atualização da linha de resumo acessível (aria-live="polite")
  atualizarLinhaResumo(produtosFiltrados);

  // 4. Sincronização do painel de métricas analíticas
  atualizarMetricasEstoque();
}

/**
 * Atualiza o anúncio da linha de resumo.
 * Por possuir aria-live="polite" no HTML, qualquer alteração em seu textContent
 * é comunicada pelo leitor de tela sem interromper a navegação do usuário.
 */
function atualizarLinhaResumo(produtosFiltrados) {
  if (!dom.linhaResumo) return;

  const totalExibido = produtosFiltrados.length;
  const totalGeral = CATALOGO_PRODUTOS_VOLT.length;

  if (totalExibido === 0) {
    dom.linhaResumo.textContent =
      "Nenhum produto encontrado para os filtros selecionados.";
    return;
  }

  const paresTotais = produtosFiltrados.reduce(
    (acumulador, item) => acumulador + item.estoque,
    0
  );

  const valorTotalEstoque = produtosFiltrados.reduce(
    (acumulador, item) => acumulador + item.preco * item.estoque,
    0
  );

  const rotuloModelos = totalExibido === 1 ? "modelo exibido" : "modelos exibidos";
  const rotuloPares = paresTotais === 1 ? "par disponível" : "pares disponíveis";

  dom.linhaResumo.textContent = `Exibindo ${totalExibido} de ${totalGeral} ${rotuloModelos} (${paresTotais} ${rotuloPares} | Total: ${formatarMoeda(valorTotalEstoque)}).`;
}

/**
 * Atualiza os valores do painel de métricas analíticas (reduce e estatísticas)
 */
function atualizarMetricasEstoque() {
  if (!dom.painelMetricas) return;

  const totalPares = CATALOGO_PRODUTOS_VOLT.reduce((acc, p) => acc + p.estoque, 0);
  const patrimonioTotal = CATALOGO_PRODUTOS_VOLT.reduce(
    (acc, p) => acc + p.preco * p.estoque,
    0
  );
  const somaPrecos = CATALOGO_PRODUTOS_VOLT.reduce((acc, p) => acc + p.preco, 0);
  const mediaPreco = somaPrecos / CATALOGO_PRODUTOS_VOLT.length;
  const criticos = CATALOGO_PRODUTOS_VOLT.filter((p) => p.estoque <= 5).length;

  if (dom.metricaPatrimonio) dom.metricaPatrimonio.textContent = formatarMoeda(patrimonioTotal);
  if (dom.metricaPares) dom.metricaPares.textContent = `${totalPares} un.`;
  if (dom.metricaMedia) dom.metricaMedia.textContent = formatarMoeda(mediaPreco);
  if (dom.metricaCriticos) dom.metricaCriticos.textContent = `${criticos} modelos`;
}

// ============================================================================
// 4. DELEGAÇÃO DE EVENTOS
// Um único ouvinte registrado no contêiner pai da lista usando
// evento.target.closest(...) e dataset para identificar o elemento acionado.
// Funciona de forma transparente para cards criados dinamicamente a qualquer momento.
// ============================================================================
function lidarComCliqueLista(evento) {
  // Busca o elemento interativo que contenha o atributo data-acao
  const elementoAcao = evento.target.closest("[data-acao]");
  if (!elementoAcao || !dom.listaCatalogo.contains(elementoAcao)) {
    return;
  }

  const { acao } = elementoAcao.dataset;

  // Ação de limpar filtros acionada a partir do estado vazio
  if (acao === "limpar-filtros") {
    redefinirFiltros();
    return;
  }

  // Identifica o card e o produto associado através do dataset
  const cardPai = elementoAcao.closest(".resultado-card");
  const idProduto = elementoAcao.dataset.id || (cardPai ? cardPai.dataset.id : null);
  if (!idProduto) return;

  const produto = CATALOGO_PRODUTOS_VOLT.find((item) => item.id === idProduto);
  if (!produto) return;

  if (acao === "favoritar") {
    alternarFavorito(produto, elementoAcao);
  } else if (acao === "detalhes") {
    alternarDetalhesCard(elementoAcao, cardPai);
  }
}

/**
 * Alterna estado de favorito e sincroniza o atributo aria-pressed
 */
function alternarFavorito(produto, botaoFavoritar) {
  const isFavorito = estadoApp.favoritos.has(produto.id);

  if (isFavorito) {
    estadoApp.favoritos.delete(produto.id);
    botaoFavoritar.setAttribute("aria-pressed", "false");
    botaoFavoritar.setAttribute("aria-label", `Favoritar ${produto.nome}`);
    botaoFavoritar.classList.remove("favoritado");
    botaoFavoritar.textContent = "☆ Favoritar";
  } else {
    estadoApp.favoritos.add(produto.id);
    botaoFavoritar.setAttribute("aria-pressed", "true");
    botaoFavoritar.setAttribute("aria-label", `Remover ${produto.nome} dos favoritos`);
    botaoFavoritar.classList.add("favoritado");
    botaoFavoritar.textContent = "★ Favorito";
  }
}

/**
 * Alterna a visibilidade dos detalhes técnicos do card via aria-expanded
 */
function alternarDetalhesCard(botaoDetalhes, cardPai) {
  if (!cardPai) return;
  const painelDetalhes = cardPai.querySelector(".card-detalhes-conteudo");
  if (!painelDetalhes) return;

  const estaAberto = botaoDetalhes.getAttribute("aria-expanded") === "true";
  const novoEstado = !estaAberto;

  botaoDetalhes.setAttribute("aria-expanded", String(novoEstado));
  botaoDetalhes.textContent = novoEstado ? "Ocultar Detalhes" : "Ver Detalhes";
  painelDetalhes.hidden = !novoEstado;
}

// ============================================================================
// 5. CONTROLE COM ESTADO ACESSÍVEL (aria-expanded e tecla Escape com foco)
// Alterna visibilidade do painel analítico com aria-expanded, fecha com Escape
// e devolve o foco para o botão de origem.
// ============================================================================
function abrirPainelMetricas() {
  if (!dom.painelMetricas || !dom.btnTogglePainel) return;

  estadoApp.painelMetricasAberto = true;
  estadoApp.ultimoElementoFocado = dom.btnTogglePainel;

  dom.btnTogglePainel.setAttribute("aria-expanded", "true");
  dom.painelMetricas.hidden = false;

  // Move o foco para dentro do painel para facilitar navegação assistiva
  if (dom.btnFecharPainel) {
    dom.btnFecharPainel.focus();
  }
}

function fecharPainelMetricas() {
  if (!dom.painelMetricas || !dom.btnTogglePainel) return;

  estadoApp.painelMetricasAberto = false;
  dom.btnTogglePainel.setAttribute("aria-expanded", "false");
  dom.painelMetricas.hidden = true;

  // Devolve o foco de forma acessível ao botão que abriu o painel
  if (estadoApp.ultimoElementoFocado) {
    estadoApp.ultimoElementoFocado.focus();
    estadoApp.ultimoElementoFocado = null;
  } else {
    dom.btnTogglePainel.focus();
  }
}

function lidarComTogglePainel() {
  if (estadoApp.painelMetricasAberto) {
    fecharPainelMetricas();
  } else {
    abrirPainelMetricas();
  }
}

function lidarComFecharPainel() {
  fecharPainelMetricas();
}

/**
 * Ouvinte global de teclado: Suporte à tecla Escape para fechar o painel e devolver o foco
 */
function lidarComTecladoGlobal(evento) {
  if (evento.key === "Escape" || evento.key === "Esc") {
    if (estadoApp.painelMetricasAberto) {
      fecharPainelMetricas();
    }
  }
}

// ============================================================================
// 6. BUSCA E FILTRO
// Input e Select com ouvintes que acionam a função desenhar() sem recriar
// ou quebrar os ouvintes de eventos da página.
// ============================================================================
function lidarComBusca(evento) {
  estadoApp.filtroTexto = evento.target.value;
  desenhar();
}

function lidarComFiltroCategoria(evento) {
  estadoApp.filtroCategoria = evento.target.value;
  desenhar();
}

function redefinirFiltros() {
  estadoApp.filtroTexto = "";
  estadoApp.filtroCategoria = "todos";

  if (dom.campoBusca) {
    dom.campoBusca.value = "";
  }
  if (dom.filtroCategoria) {
    dom.filtroCategoria.value = "todos";
  }

  desenhar();

  if (dom.campoBusca) {
    dom.campoBusca.focus();
  }
}

// ============================================================================
// 7. PADRÃO DE ARQUITETURA E INICIALIZAÇÃO
// - Funções nomeadas registradas como ouvintes
// - Nenhum onclick no HTML
// - Nenhum ouvinte registrado dentro de loops ou funções repetitivas
// ============================================================================
function inicializarEventos() {
  // Delegação no container pai da lista
  if (dom.listaCatalogo) {
    dom.listaCatalogo.addEventListener("click", lidarComCliqueLista);
  }

  // Filtros reativos
  if (dom.campoBusca) {
    dom.campoBusca.addEventListener("input", lidarComBusca);
  }

  if (dom.filtroCategoria) {
    dom.filtroCategoria.addEventListener("change", lidarComFiltroCategoria);
  }

  // Painel com estado acessível
  if (dom.btnTogglePainel) {
    dom.btnTogglePainel.addEventListener("click", lidarComTogglePainel);
  }

  if (dom.btnFecharPainel) {
    dom.btnFecharPainel.addEventListener("click", lidarComFecharPainel);
  }

  // Atalho por teclado (Escape)
  document.addEventListener("keydown", lidarComTecladoGlobal);
}

// Registra os ouvintes e executa a renderização inicial
inicializarEventos();
desenhar();
