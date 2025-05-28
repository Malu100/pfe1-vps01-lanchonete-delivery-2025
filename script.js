// Seletores principais
const selectProduto = document.getElementById("produto");
const btnAdicionar = document.getElementById("btnAdicionar");
const listaExecucao = document.getElementById("listaExecucao");
const listaEntrega = document.getElementById("listaEntrega");
const btnFinalizados = document.getElementById("btnFinalizados");
const campoDataHora = document.getElementById("dataHora");

// Atualiza data/hora em tempo real
setInterval(() => {
  const agora = new Date();
  campoDataHora.textContent = `Data/Hora atual: ${agora.toLocaleString()}`;
}, 1000);

// Carregar opções de produtos
produtos.forEach((produto) => {
  const option = document.createElement("option");
  option.value = produto.id;
  option.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)}`;
  selectProduto.appendChild(option);
});

// Botão de adicionar pedido
btnAdicionar.addEventListener("click", () => {
  const cliente = document.getElementById("cliente").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const produtoId = parseInt(selectProduto.value);

  if (!cliente || !endereco || isNaN(produtoId)) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  const produto = produtos.find((p) => p.id === produtoId);
  const pedido = {
    id: Date.now(),
    cliente,
    endereco,
    produto: produto.nome,
    preco: produto.preco,
    data: new Date().toLocaleString()
  };

  renderCard(pedido, listaExecucao, true);
  limparCampos();
});

// Renderiza um card de pedido
function renderCard(pedido, container, emExecucao = true) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <h3>${pedido.cliente}</h3>
    <p><strong>Produto:</strong> ${pedido.produto}</p>
    <p><strong>Preço:</strong> R$ ${pedido.preco.toFixed(2)}</p>
    <p><strong>Endereço:</strong> ${pedido.endereco}</p>
    <p><strong>Data:</strong> ${pedido.data}</p>
    <img src="assets/${emExecucao ? 'icone.png' : 'check.png'}" class="icone" alt="Ícone ação" title="${emExecucao ? 'Enviar para entrega' : 'Finalizar pedido'}">
  `;

  const icone = card.querySelector(".icone");
  icone.style.cursor = "pointer";

  icone.addEventListener("click", () => {
    card.remove();
    if (emExecucao) {
      renderCard(pedido, listaEntrega, false);
    } else {
      salvarFinalizado(pedido);
    }
  });

  container.appendChild(card);
}

// Salva no localStorage
function salvarFinalizado(pedido) {
  const finalizados = JSON.parse(localStorage.getItem("pedidosFinalizados")) || [];
  finalizados.push(pedido);
  localStorage.setItem("pedidosFinalizados", JSON.stringify(finalizados));
}

// Redirecionar para a página de finalizados
btnFinalizados.addEventListener("click", () => {
  window.location.href = "finalizados.html";
});

// Limpar campos
function limparCampos() {
  document.getElementById("cliente").value = "";
  document.getElementById("endereco").value = "";
  selectProduto.selectedIndex = 0;
}
