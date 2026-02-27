const api = "http://localhost:3000/pessoas";

async function carregar() {
  try {
    const res = await fetch(api);
    const pessoas = await res.json();
    if (res.ok) {
      console.log("Carregado com sucesso");
    } else {
      console.log("Erro ao carregar pessoas");
    }
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    pessoas.forEach((p) => {
      lista.innerHTML += `
      <li>
        ${p.nome} - ${p.email} - ${p.telefone}
        <button onclick="editar('${p._id}', '${p.nome}', '${p.email}', '${p.telefone}')">Editar</button>
        <button onclick="deletar('${p._id}')">Excluir</button>
      </li>
    `;
    });
  } catch (err) {
    console.log(err);
  }
}

async function salvar() {
  const id = document.getElementById("id").value;
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;

  const dados = { nome, email, telefone };

  if (id) {
    try {
      const res = await fetch(`${api}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (res.status === 201) {
        console.log("Editado com sucesso");
      } else {
        console.log("Erro ao editar pessoa");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (res.status === 201) {
        console.log("Salvo com sucesso");
      } else {
        console.log("Erro ao salvar pessoa");
      }
    } catch (err) {
      console.log(err);
    }
  }

  limpar(); // limpa os input
  carregar(); // atualiza a lista automaticamente
}

function editar(id, nome, email, telefone) {
  document.getElementById("id").value = id;
  document.getElementById("nome").value = nome;
  document.getElementById("email").value = email;
  document.getElementById("telefone").value = telefone;
}

async function deletar(id) {
  if (confirm("Tem certeza que deseja excluir?")) {
    await fetch(`${api}/${id}`, { method: "DELETE" });
    carregar();
  }
}

async function buscar() {
  const busca = document.getElementById("busca").value;
  const res = await fetch(`${api}/nome/${busca}`);
  const pessoas = await res.json();

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  pessoas.forEach((p) => {
    lista.innerHTML += `
      <li>
        ${p.nome} - ${p.email} - ${p.telefone}
        <button onclick="editar('${p._id}', '${p.nome}', '${p.email}', '${p.telefone}')">Editar</button>
        <button onclick="deletar('${p._id}')">Excluir</button>
      </li>
    `;
  });
}

async function contador() {
  const res = await fetch(api);
  const pessoas = await res.json();
  document.getElementById("contador").innerHTML = pessoas.length;
}
function limpar() {
  document.getElementById("id").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";
  document.getElementById("telefone").value = "";
}
