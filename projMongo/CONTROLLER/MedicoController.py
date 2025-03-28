# PessoaController.py
from MODEL.MedicoModel import Medico, MedicoModel

class MedicoController:
    def __init__(self):
        self.model = MedicoModel()

    def listar_medicos(self):
        return self.model.listar_todos()

    def criar_medico(self, data):
        # Espera data = {"id":..., "nome":..., "fone":..., "aniversario":...}
        medico = Medico(
            pid=data["id"],
            nome=data["nome"],
            fone=data["fone"],
            aniversario=data["aniversario"],
            cpf=data["cpf"],
            especializacao=data["especializacao"]
        )
        self.model.criar_medico(medico)

    def atualizar_medico(self, pid, data):
        medico = Medico(
            pid=pid,
            nome=data["nome"],
            fone=data["fone"],
            aniversario=data["aniversario"],
            cpf=data["cpf"],
            especializacao=data["especializacao"]
        )
        return self.model.atualizar_medico(medico)

    def deletar_medico(self, pid):
        return self.model.deletar_medico(pid)
