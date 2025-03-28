# PessoaController.py
from MODEL.AgendaModel import Agenda, AgendaModel

class AgendaController:
    def __init__(self):
        self.model = AgendaModel()

    def listar_agendas(self):
        return self.model.listar_todos()

    def criar_agenda(self, data):
        # Espera data = {"id":..., "nome":..., "fone":..., "aniversario":...}
        agenda = Agenda(
            pid=data["id"],
            nomePessoa=data["nomePessoa"],
            fonePessoa=data["fonePessoa"],
            nomeMedico=data["nomeMedico"],
            tipoConsulta=data["tipoConsulta"],
            horario=data["horario"],
            dia=data["dia"]
        )
        self.model.criar_agenda(agenda)

    def atualizar_agenda(self, pid, data):
        agenda = Agenda(
            pid=pid,
            nomePessoa=data["nomePessoa"],
            fonePessoa=data["fonePessoa"],
            nomeMedico=data["nomeMedico"],
            tipoConsulta=data["tipoConsulta"],
            horario=data["horario"],
            dia=data["dia"]
        )
        return self.model.atualizar_agenda(agenda)

    def deletar_agenda(self, pid):
        return self.model.deletar_agenda(pid)
