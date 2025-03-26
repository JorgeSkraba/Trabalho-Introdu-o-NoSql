// pessoa.js

var API_URL = ""; // Se estiver no mesmo servidor Flask, deixe vazio ou "/".

var listaMedicos = [];

/**
 * Formata os telefones.
 */
function formatarTelefone(fone) {
  // Remove tudo que não for dígito
  let digits = "";
  try{
    digits = fone.replace(/\D/g, "");
  } catch(erro){
    digits = "0000000000"
  }

  if (digits.length === 10) {
    // (XX) XXXX-XXXX
    const ddd = digits.slice(0, 2);
    const parte1 = digits.slice(2, 6);
    const parte2 = digits.slice(6);
    return `(${ddd}) ${parte1}-${parte2}`;
  } else if (digits.length === 11) {
    // (XX) XXXXX-XXXX
    const ddd = digits.slice(0, 2);
    const parte1 = digits.slice(2, 7);
    const parte2 = digits.slice(7);
    return `(${ddd}) ${parte1}-${parte2}`;
  } else {
    if (digits.length<10) {
      return fone + " [Fone inválido]";
    } else {
      return fone;
    }
  }
}

/*
* Formata a data
*/
function formatarData(dataISO) {
  // dataISO no formato "YYYY-MM-DD"
  let ano = "";
  let mes = "";
  let dia = "";
  try {
    [ano, mes, dia] = dataISO.split("-");    
  } catch (error) {
    try {
      [ano, mes, dia] = dataISO.split("/");
    } catch (error) {
      ano = "2000";
      mes = "01";
      dia = "01";
    }  
  }
  return `${dia}/${mes}/${ano}`;
}

function editarMedico(pid) {
  // Busca a pessoa na variável global
  const medico = listaMedicos.find(p => p.id === pid);
  if (!medico) {
    Swal.fire({
      icon: 'error',
      title: 'Erro na busca',
      text: "Medico com id:"+pid+" não foi localizada!"
    });
    return;
  }

  // Preenche os campos do formulário
  $("#inputId").val(medico.id);
  //$("#inputId").prop("readonly", true);
  $("#inputId").attr("disabled", false);
  $("#inputNome").val(medico.nome);
  $("#inputFone").val(medico.fone); // se quiser manter o formato original
  $("#inputAniversario").val(medico.aniversario); // formato YYYY-MM-DD
  $("#inputcpf").val(medico.cpf);
  $("#inputcpf").prop("readonly", true);
  //$("#inputcpf").attr("disabled", true);
  $("#inputespecializacao").val(medico.especializacao);
  $('#staticBackdrop').modal('show');

  // Se quiser deixar o ID como somente leitura, pode fazer:
  // $("#inputId").prop("readonly", true);

  // Agora o usuário pode alterar os dados e depois clicar em "Atualizar".
}

/**
 * Carrega a lista de pessoas e preenche a tabela.
 */
function carregarMedicos() {
  $.ajax({
    url: API_URL + "/medicos",
    method: "GET",
    success: function(dados) {
      listaMedicos = dados;
      console.log(dados);
      const tbody = $("#tabelaMedicos tbody");
      tbody.empty();
      dados.forEach((p) => {
        tbody.append(`
          <tr>
            <td>${p.id}</td>
            <td>${p.nome}</td>
            <td>${formatarTelefone(p.fone)}</td>
            <td>${formatarData(p.aniversario)}</td>
            <td>${p.cpf}</td>
            <td>${p.especializacao}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarMedico(${p.id})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="deletarMedico(${p.id})">
                Deletar
              </button>
            </td>
          </tr>
        `);
      });
    },
    error: function(err) {
      console.error(err);
    }
  });
}

/**
 * Cria uma nova pessoa (POST).
 */
function criarMedico() {
  const medico = {
    id: parseInt($("#inputId").val()),
    nome: $("#inputNome").val(),
    fone: $("#inputFone").val(),
    aniversario: $("#inputAniversario").val(),
    cpf: $("#inputcpf").val(),
    especializacao: $("#inputespecializacao").val()

  };
  $.ajax({
    url: API_URL + "/medicos",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(medico),
    success: function(res) {
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: res.mensagem
      });
      carregarMedicos();
      $("#formMedico")[0].reset();
    },
    error: function(err) {
      console.error(err);
    }
  });
}

function IncluirMedico() {
  $("#inputId").val(0);
  $("#inputId").attr("disabled", true);
  $("#inputNome").val("");
  $("#inputFone").val("");
  $("#inputAniversario").val("");
  $("#inputcpf").val("");
  $("#inputespecializacao").val("");
  $('#staticBackdrop').modal('show');
}

function gravarDados() {
  let id = $("#inputId").val();
  if (id == 0) {
    criarMedico();
  } else {
    atualizarMedico();
  }
}

/**
 * Atualiza uma pessoa (PUT).
 */
function atualizarMedico() {
  const pid = parseInt($("#inputId").val());
  //const cpf = $("#inputcpf").val();
  const dados = {
    nome: $("#inputNome").val(),
    fone: $("#inputFone").val(),
    aniversario: $("#inputAniversario").val(),
    especializacao: $("#inputespecializacao").val()

  };
  $.ajax({
    url: API_URL + "/medicos/" + pid,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(dados),
    success: function(res) {
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: res.mensagem
      });
      carregarMedicos();
      $("#formMedico")[0].reset();
    },
    error: function(err) {
      console.error(err);
    }
  });
}

/**
 * Deleta uma pessoa (DELETE).
 */
function deletarMedico(pid) {
  Swal.fire({
    title: 'Confirmação de Exclusão',
    text: `Tem certeza que deseja excluir o medico de ID ${pid}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, EXCLUIR!',
    cancelButtonText: 'Não'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: API_URL + "/medicos/" + pid,
        method: "DELETE",
        success: function(res) {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: res.mensagem
          });
          carregarMedicos();
        },
        error: function(err) {
          console.error(err);
        }
      });
    }
  });
}

$(document).ready(function(){
  carregarMedicos();
})