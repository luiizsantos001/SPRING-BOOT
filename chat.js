const chatBtn = document.getElementById("chat-btn");
const chatBox = document.getElementById("chat-box");
const messages = document.getElementById("chat-messages");
const options = document.getElementById("chat-options");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

let aberto = false;
let carrinho = [];
let digitandoEl = null;

// ABRIR
chatBtn.onclick = () => {
  aberto = !aberto;
  chatBox.style.display = aberto ? "flex" : "none";

  if (aberto && messages.innerHTML === "") iniciarChat();
};

// MINIMIZAR
document.getElementById("min-chat").onclick = () => {
  chatBox.style.display = "none";
  aberto = false;
};

// LIMPAR CHAT
document.getElementById("clear-chat").onclick = limparChat;

// MENSAGEM
function msg(text, tipo = "bot") {
  const el = document.createElement("div");
  el.innerText = text;
  el.classList.add(tipo === "user" ? "user-msg" : "bot-msg");

  messages.appendChild(el);

  if (messages.children.length > 40) {
    messages.removeChild(messages.firstChild);
  }

  messages.scrollTop = messages.scrollHeight;
}

// DIGITANDO
function digitando() {
  pararDigitando();
  digitandoEl = document.createElement("div");
  digitandoEl.innerText = "Digitando...";
  digitandoEl.classList.add("bot-msg");
  messages.appendChild(digitandoEl);
  messages.scrollTop = messages.scrollHeight;
}

function pararDigitando() {
  if (digitandoEl) {
    digitandoEl.remove();
    digitandoEl = null;
  }
}

// BOTÃO
function opcao(text, callback) {
  const btn = document.createElement("button");
  btn.innerText = text;
  btn.classList.add("option");
  btn.onclick = callback;
  options.appendChild(btn);
}

// LIMPAR OPÇÕES
function limparOpcoes() {
  options.innerHTML = "";
}

// INÍCIO
function iniciarChat() {
  limparOpcoes();
  carrinho = [];

  msg("👋 Bem-vindo à CruzBurgers!");
  msg("Escolha uma opção:");

  opcao("🍔 Ver cardápio", mostrarMenu);
  opcao("🛒 Ver carrinho", verCarrinho);
}

// MENU
function mostrarMenu() {
  limparOpcoes();

  msg("Veja nossos hambúrgueres 😋");

  opcao("🍔 X-Burger - R$28", () => adicionar("X-Burger", 28));
  opcao("🥓 X-Bacon - R$32", () => adicionar("X-Bacon", 32));
  opcao("🔥 X-Tudo - R$38", () => adicionar("X-Tudo", 38));
}

// ADICIONAR
function adicionar(nome, preco) {
  carrinho.push({ nome, preco });

  msg("Quero " + nome, "user");
  msg("Item adicionado 🛒");

  limparOpcoes();
  opcao("➕ Continuar comprando", mostrarMenu);
  opcao("🛒 Ver carrinho", verCarrinho);
}

// CARRINHO
function verCarrinho() {
  limparOpcoes();

  if (carrinho.length === 0) {
    msg("Seu carrinho está vazio 😢");
    opcao("🍔 Ver cardápio", mostrarMenu);
    return;
  }

  msg("🛒 Seu carrinho:");

  let total = 0;

  carrinho.forEach(item => {
    msg(`${item.nome} - R$${item.preco}`);
    total += item.preco;
  });

  msg("💰 Total: R$" + total);

  opcao("💳 Finalizar pedido", finalizarPedido);
  opcao("➕ Continuar comprando", mostrarMenu);
}

// FINALIZAR
function finalizarPedido() {
  let total = 0;
  let texto = "Pedido:%0A";

  carrinho.forEach(item => {
    texto += `- ${item.nome}%0A`;
    total += item.preco;
  });

  texto += `Total: R$${total}`;

  msg("Finalizando pedido... 🚀");

  setTimeout(() => {
    window.open("https://wa.me/559999999999?text=" + texto);
  }, 1000);
}

// LIMPAR CHAT
function limparChat() {
  messages.innerHTML = "";
  limparOpcoes();
  carrinho = [];

  msg("🧹 Conversa limpa!");
  msg("Como posso te ajudar?");

  opcao("🍔 Ver cardápio", mostrarMenu);
}

// INPUT
sendBtn.onclick = enviarMensagem;

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") enviarMensagem();
});

// ENVIAR
function enviarMensagem() {
  const texto = input.value.trim();
  if (!texto) return;

  msg(texto, "user");
  input.value = "";

  responder(texto);
}

// RESPOSTA VIA SPRING BOOT
async function responder(texto) {
  digitando();

  try {
    const response = await fetch("http://127.0.0.1:8080/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: texto })
    });

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    const data = await response.json();

    pararDigitando();
    msg(data.reply);

  } catch (error) {
    pararDigitando();
    msg("Erro ao conectar com o servidor 😢");
    console.error(error);
  }
}
