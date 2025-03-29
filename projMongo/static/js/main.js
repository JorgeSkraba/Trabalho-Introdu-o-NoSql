// main.js
$(document).ready(function() {
    // Ao clicar em "Pessoas" no menu, carregamos pessoa.html
    $("#linkPessoas").click(function(e) {
      e.preventDefault();
      $("#divPrincipal").load("/view/pessoa", function() {
        // Após carregar o HTML, carregamos o script do CRUD
        $.getScript("JS/pessoa.js")
          .done(function() {
            // Inicializa os eventos e carrega a lista de pessoas            
          })
          .fail(function() {
            console.error("Não foi possível carregar pessoa.js");
          });
      });
    });
    //=========================================================
    $("#linkMedicos").click(function(e) {
      e.preventDefault();
      $("#divPrincipal").load("/view/medico", function() {
        // Após carregar o HTML, carregamos o script do CRUD
        $.getScript("JS/medico.js")
          .done(function() {
            // Inicializa os eventos e carrega a lista de pessoas            
          })
          .fail(function() {
            console.error("Não foi possível carregar medico.js");
          });
      });
    });
    //=========================================================
    $("#linkAgendas").click(function(e) {
      e.preventDefault();
      $("#divPrincipal").load("/view/agenda", function() {
        // Após carregar o HTML, carregamos o script do CRUD
        $.getScript("JS/agenda.js")
          .done(function() {
            // Inicializa os eventos e carrega a lista de pessoas            
          })
          .fail(function() {
            console.error("Não foi possível carregar agenda.js");
          });
      });
    });
        //=========================================================
        $("#linkTestes").click(function(e) {
          e.preventDefault();
          $("#divPrincipal").load("/view/teste", function() {
            // Após carregar o HTML, carregamos o script do CRUD
            $.getScript("JS/teste.js")
              .done(function() {
                // Inicializa os eventos e carrega a lista de pessoas            
              })
              .fail(function() {
                console.error("Não foi possível carregar agenda.js");
              });
          });
        });
  });
  
