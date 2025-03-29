  // agenda.js

  var API_URL = ""; // Se estiver no mesmo servidor Flask, deixe vazio ou "/".

  var listaAgendas = [];
  var listaPessoas = [];
  var listaMedicos = [];

  /**
   * Carrega a lista de pessoas e preenche os campos de paciente.
   */
  function carregarPessoas() {
    $.ajax({
      url: API_URL + "/pessoas", // Ajuste conforme necessário
      method: "GET",
      success: function(dados) {
        listaPessoas = dados;
        // Preenche os campos de pacientes com as opções
        const selectPaciente = $("#inputNomePac");
        selectPaciente.empty();
        selectPaciente.append(`<option value="">Selecione o Paciente</option>`);
        dados.forEach((p) => {
          selectPaciente.append(`<option value="${p.id}">${p.nome}</option>`);
        });
        // Agora que a lista de pessoas foi carregada, carregar as agendas
        carregarAgendas();
      },
      error: function(err) {
        console.error(err);
      }
    });
  }

  /**
   * Atualiza o telefone e nome do paciente com base no paciente selecionado.
   */
  function atualizarPacienteSelecionado() {
    const pacienteId = $("#inputNomePac").val();
    const paciente = listaPessoas.find(p => p.id == pacienteId);

    if (paciente) {
      $("#inputFonePac").val(paciente.fone);
    } else {
      $("#inputFonePac").val("");  // Limpa o campo se nenhum paciente for selecionado
    }
  }


  function carregarMedicos() {
    $.ajax({
      url: API_URL + "/medicos", // Ajuste conforme necessário
      method: "GET",
      success: function(dados) {
        listaMedicos = dados;
        // Preenche os campos de pacientes com as opções
        const selectMedico = $("#inputNomeMed");
        selectMedico.empty();
        selectMedico.append(`<option value="">Selecione o Médico</option>`);
        dados.forEach((p) => {
          selectMedico.append(`<option value="${p.id}">${p.nome}</option>`);
        });
        // Agora que a lista de pessoas foi carregada, carregar as agendas
        carregarAgendas();
      },
      error: function(err) {
        console.error(err);
      }
    });
  }


  function atualizarMedicoSelecionado() {
    const medicoId = $("#inputNomeMed").val();
    const medico = listaMedicos.find(p => p.id == medicoId);

    if (medico) {
      $("#inputespecializacao").val(medico.especializacao);
    } else {
      $("#inputespecializacao").val("");  // Limpa o campo se nenhum paciente for selecionado
    }
  }
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


    //   // 🔹 Limpa os campos antes de preenchê-los para evitar valores antigos
    // $("#inputId").val("").change();
    // $("#inputNomePac").val("").change();
    // $("#inputFonePac").val("").change();
    // $("#inputNomeMed").val("").change();
    // $("#inputespecializacao").val("").change();
    // $("#inputhorario").val("").change();
    // $("#inputdia").val("").change();

    // Preenche os campos do formulário
    $("#inputId").val(agenda.id);
    $("#inputId").attr("disabled", true);
    // $("#inputNomePac").val(agenda.id);
    // $("#inputFonePac").val(agenda.fone);
    $("#inputhorario").val(agenda.horario);
    $("#inputdia").val(agenda.dia);

    setTimeout(() => {
      // 🔹 Paciente
      const paciente = listaPessoas.find(p => p.id == agenda.nomePessoa);
      if (paciente) {
          $("#inputNomePac").val(paciente.id).change();
          $("#inputFonePac").val(paciente.fone);
      } else {
          $("#inputNomePac").val("").change();
          $("#inputFonePac").val("");
      }

      // 🔹 Médico
      const medico = listaMedicos.find(m => m.id == agenda.nomeMedico);
      if (medico) {
          $("#inputNomeMed").val(medico.id).change();
          $("#inputespecializacao").val(medico.especializacao);
      } else {
          $("#inputNomeMed").val("").change();
          $("#inputespecializacao").val("");
      }

      // Exibe o modal após preencher os campos
      $('#staticBackdrop').modal('show');

  }, 500); // Pequeno atraso para garantir que os selects estão carregados
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
          
          const pessoa = listaPessoas.find(person => person.id == p.nomePessoa); // Usa nomePessoa como ID
          const nomePessoa = pessoa ? pessoa.nome : `ID: ${p.nomePessoa} (Paciente não encontrado)`;

          const medico = listaMedicos.find(person => person.id == p.nomeMedico); // Usa nomePessoa como ID
          const nomeMedico = medico ? medico.nome : `ID: ${p.nomeMedico} (Medico não encontrado)`;

          tbody.append(`
            <tr>
              <td>${p.id}</td>
              <td>${nomePessoa}</td>
              <td>${formatarTelefone(p.fonePessoa)}</td>
              <td>${nomeMedico}</td>
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

    carregarPessoas();
    carregarMedicos();
    // // Atualiza o telefone quando o paciente for selecionado
    // $("#inputNomePac").on("change", atualizarPacienteSelecionado);

    // carregarAgendas();
    setTimeout(() => {
      carregarAgendas(); // Aguarda um tempo para garantir que os pacientes foram carregados
    }, 1000); // Ajuste o tempo conforme necessário

    $("#inputNomePac").on("change", atualizarPacienteSelecionado);
    $("#inputNomeMed").on("change", atualizarMedicoSelecionado);
  })