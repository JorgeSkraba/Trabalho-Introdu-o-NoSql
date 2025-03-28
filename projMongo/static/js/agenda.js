// agenda.js

var API_URL = ""; // Se estiver no mesmo servidor Flask, deixe vazio ou "/".

var listaAgendas = [];

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

function formatarHorario(horario) {
  if (!horario) return "Horário inválido";

  let partes = horario.split(":");
  if (partes.length !== 2) return "Horário inválido";

  let horas = parseInt(partes[0], 10);
  let minutos = partes[1];

  // Formato 24h → 12h com AM/PM
  let periodo = horas >= 12 ? "PM" : "AM";
  horas = horas % 12 || 12; // Converte 0 para 12 no formato de 12h

  return `${horas}:${minutos} ${periodo}`;
}


function editarAgenda(pid) {
  // Busca a pessoa na variável global
  const agenda = listaAgendas.find(p => p.id === pid);
  if (!agenda) {
    Swal.fire({
      icon: 'error',
      title: 'Erro na busca',
      text: "Registro com id:"+pid+" não foi localizada!"
    });
    return;
  }

  // Preenche os campos do formulário
  $("#inputId").val(agenda.id);
  $("#inputId").attr("disabled", false);
  $("#inputNomePac").val(agenda.nomePessoa);
  $("#inputFonePac").val(agenda.fonePessoa); // se quiser manter o formato original
  $("#inputNomeMed").val(agenda.nomeMedico); // formato YYYY-MM-DD
  $("#inputespecializacao").val(agenda.tipoConsulta);
  $("#inputhorario").val(agenda.horario);
  $("#inputdia").val(agenda.dia);
  $('#staticBackdrop').modal('show');

  // Se quiser deixar o ID como somente leitura, pode fazer:
  // $("#inputId").prop("readonly", true);

  // Agora o usuário pode alterar os dados e depois clicar em "Atualizar".
}

/**
 * Carrega a lista de pessoas e preenche a tabela.
 */
function carregarAgendas() {
  $.ajax({
    url: API_URL + "/agendas",
    method: "GET",
    success: function(dados) {
      listaAgendas = dados;
      console.log(dados);
      const tbody = $("#tabelaAgendas tbody");
      tbody.empty();
      dados.forEach((p) => {
        tbody.append(`
          <tr>
            <td>${p.id}</td>
            <td>${p.nomePessoa}</td>
            <td>${formatarTelefone(p.fonePessoa)}</td>
            <td>${p.nomeMedico}</td>
            <td>${p.tipoConsulta}</td>
            <td>${formatarHorario(p.horario)}</td>
            <td>${formatarData(p.dia)}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarAgenda(${p.id})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="deletarAgenda(${p.id})">
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
function criarAgenda() {
  const agenda = {
    id: parseInt($("#inputId").val()),
    nomePessoa: $("#inputNomePac").val(),
    fonePessoa: $("#inputFonePac").val(),
    nomeMedico: $("#inputNomeMed").val(),
    tipoConsulta: $("#inputespecializacao").val(),
    horario: $("#inputhorario").val(),
    dia: $("#inputdia").val()

  };
  $.ajax({
    url: API_URL + "/agendas",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(agenda),
    success: function(res) {
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: res.mensagem
      });
      carregarAgendas();
      $("#formAgenda")[0].reset();
    },
    error: function(err) {
      console.error(err);
    }
  });
}

function IncluirAgenda() {
  $("#inputId").val(0);
  $("#inputId").attr("disabled", true);
  $("#inputNomePac").val("");
  $("#inputFonePac").val("");
  $("#inputNomeMed").val("");
  $("#inputespecializacao").val("");
  $("#inputhorario").val("");
  $("#inputdia").val("");
  $('#staticBackdrop').modal('show');
}

function gravarDados() {
  let id = $("#inputId").val();
  if (id == 0) {
    criarAgenda();
  } else {
    atualizarAgenda();
  }
}

/**
 * Atualiza uma pessoa (PUT).
 */
function atualizarAgenda() {
  const pid = parseInt($("#inputId").val());
  //const cpf = $("#inputcpf").val();
  const dados = {
    nomePessoa: $("#inputNomePac").val(),
    fonePessoa: $("#inputFonePac").val(),
    nomeMedico: $("#inputNomeMed").val(),
    tipoConsulta: $("#inputespecializacao").val(),
    horario: $("#inputhorario").val(),
    dia: $("#inputdia").val()

  };
  $.ajax({
    url: API_URL + "/agendas/" + pid,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(dados),
    success: function(res) {
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: res.mensagem
      });
      carregarAgendas();
      $("#formAgenda")[0].reset();
    },
    error: function(err) {
      console.error(err);
    }
  });
}

/**
 * Deleta uma pessoa (DELETE).
 */
function deletarAgenda(pid) {
  Swal.fire({
    title: 'Confirmação de Exclusão',
    text: `Tem certeza que deseja excluir o registro de ID ${pid}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, EXCLUIR!',
    cancelButtonText: 'Não'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: API_URL + "/agendas/" + pid,
        method: "DELETE",
        success: function(res) {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: res.mensagem
          });
          carregarAgendas();
        },
        error: function(err) {
          console.error(err);
        }
      });
    }
  });
}

$(document).ready(function(){
  carregarAgendas();
})