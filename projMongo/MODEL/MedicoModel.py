# PessoaModel.py
from pymongo import MongoClient

class Medico:
    """Entidade que representa uma Medico."""
    def __init__(self, pid, nome, fone, aniversario, cpf, especializacao):
        self.pid = pid
        self.nome = nome
        self.fone = fone
        self.aniversario = aniversario
        self.cpf = cpf
        self.especializacao = especializacao

class MedicoModel:
    """Classe responsável pela persistência de dados de Pessoa no MongoDB."""
    def __init__(self, uri="mongodb://localhost:27017/", dbname="ConsultorioMedico"):
        self.client = MongoClient(uri)
        self.db = self.client[dbname]
        self.collection = self.db["Medicos"]

    def listar_todos(self):
        cursor = self.collection.find({}, {"_id": 0})
        return list(cursor)

    def criar_medico(self, medico: Medico):
        doc = {
            "id": self.next_val(),
            "nome": medico.nome,
            "fone": medico.fone,
            "aniversario": medico.aniversario,
            "cpf": medico.cpf,
            "especializacao": medico.especializacao
        }
        self.collection.insert_one(doc)

    def atualizar_medico(self, medico: Medico):
        result = self.collection.update_one(
            {"id": medico.pid},
            {"$set": {
                "nome": medico.nome,
                "fone": medico.fone,
                "aniversario": medico.aniversario,
                "cpf": medico.cpf,
                "especializacao": medico.especializacao
            }}
        )
        return result.modified_count  # 0 ou 1

    def deletar_medico(self, pid: int):
        result = self.collection.delete_one({"id": pid})
        return result.deleted_count  # 0 ou 1
    
    def obter_maior_id(self):
        doc = self.collection.find({}, {"_id": 0, "id": 1}) \
                             .sort("id", -1) \
                             .limit(1)
        lista = list(doc)
        if not lista:
            return 0  # Se não há documentos, retornamos 0
        return lista[0]["id"]
    
    def next_val(self):
        return self.obter_maior_id() + 1
