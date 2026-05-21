// Carrega usuarios do localStorage ou cria array vazio
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

const form = document.getElementById("formLogin");
const inputNome = document.getElementById("nome");
const inputSenha = document.getElementById("senha");
const mensagem = document.getElementById("mensagem");

const btnListar = document.getElementById("btnListar");
const btnLimpar = document.getElementById("btnLimpar");
const listaUsuarios = document.getElementById("listaUsuarios");

// Garante que os elementos existem antes de adicionar eventos
if (form && inputNome && inputSenha && mensagem) {
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // evita recarregar a página

    const nome = inputNome.value.trim();
    const senha = inputSenha.value.trim();

    if (!nome || !senha) {
      mostrarMensagem("Preencha nome e senha.");
      return;
    }

    // Verifica se usuário já existe
    const usuarioExistente = usuarios.find(u => u.nome === nome);

    if (!usuarioExistente) {
      // Se ainda não existe e ainda há espaço (máx 6 usuários)
      if (usuarios.length >= 6) {
        mostrarMensagem("Limite de 6 usuários atingido.");
        return;
      }

      const novoUsuario = { nome, senha };
      usuarios.push(novoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios)); // salva no navegador [web:52][web:76]

      mostrarMensagem("Usuário cadastrado com sucesso! Redirecionando...", "ok");
      redirecionarHome();
    } else {
      // Se já existe, checa a senha
      if (usuarioExistente.senha === senha) {
        mostrarMensagem("Login realizado com sucesso! Redirecionando...", "ok");
        redirecionarHome();
      } else {
        mostrarMensagem("Senha incorreta para esse usuário.");
      }
    }
  });
} else {
  console.error("Elementos principais do formulário não encontrados.");
}

function mostrarMensagem(texto, tipo) {
  if (!mensagem) return;
  mensagem.textContent = texto;
  mensagem.style.color = tipo === "ok" ? "green" : "#b00020";
}

function redirecionarHome() {
  // Redireciona para outra página (home.html)
  setTimeout(() => {
    window.location.href = "home.html"; // redireciona após 1s [web:61][web:63][web:68]
  }, 1000);
}

// ====== Admin: listar e limpar usuários ======

if (btnListar && listaUsuarios) {
  btnListar.addEventListener("click", function () {
    // Recarrega do localStorage para garantir que está atualizado
    usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    listaUsuarios.innerHTML = "";

    if (usuarios.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Nenhum usuário cadastrado.";
      listaUsuarios.appendChild(li);
      return;
    }

    usuarios.forEach((u, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${u.nome}`;
      listaUsuarios.appendChild(li);
    });
  });
}

if (btnLimpar && listaUsuarios) {
  btnLimpar.addEventListener("click", function () {
    if (!confirm("Tem certeza que deseja limpar todos os usuários salvos?")) {
      return;
    }

    // Remove apenas a chave "usuarios" do localStorage
    localStorage.removeItem("usuarios"); // ou localStorage.clear() para apagar tudo [web:72][web:74][web:76]
    usuarios = [];
    listaUsuarios.innerHTML = "";
    mostrarMensagem("Usuários apagados do localStorage.", "ok");
  });
}