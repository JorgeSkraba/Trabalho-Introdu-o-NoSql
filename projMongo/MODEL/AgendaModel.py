# PessoaModel.py
from pymongo import MongoClient

class Agenda:
    """Entidade que representa uma Pessoa."""
    def __init__(self, pid, nomePessoa, fonePessoa, nomeMedico, tipoConsulta, horario, dia):
        self.pid = pid
        self.nomePessoa = nomePessoa
        self.fonePessoa = fonePessoa
        self.nomeMedico = nomeMedico
        self.tipoConsulta = tipoConsulta
        self.horario = horario
        self.dia = dia

class AgendaModel:
    """Classe responsável pela persistência de dados de Pessoa no MongoDB."""
    def __init__(self, uri="mongodb://localhost:27017/", dbname="ConsultorioMedico"):
        self.client = MongoClient(uri)
        self.db = self.client[dbname]
        self.collection = self.db["Agendas"]

    def listar_todos(self):
        cursor = self.collection.find({}, {"_id": 0})
        return list(cursor)

    def criar_agenda(self, agenda: Agenda):
        doc = {
            "id": self.next_val(),
            "nomePessoa": agenda.nomePessoa,
            "fonePessoa": agenda.fonePessoa,
            "nomeMedico": agenda.nomeMedico,
            "tipoConsulta": agenda.tipoConsulta,
            "horario": agenda.horario,
            "dia": agenda.dia
        }
        self.collection.insert_one(doc)

    def atualizar_agenda(self, agenda: Agenda):
        result = self.collection.update_one(
            {"id": agenda.pid},
            {"$set": {
                "nomePessoa": agenda.nomePessoa,
                "fonePessoa": agenda.fonePessoa,
                "nomeMedico": agenda.nomeMedico,
                "tipoConsulta": agenda.tipoConsulta,
                "horario": agenda.horario,
                "dia": agenda.dia
            }}
        )
        return result.modified_count  # 0 ou 1

    def deletar_agenda(self, pid: int):
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
