# PessoaModel.py
from pymongo import MongoClient

class Pessoa:
    """Entidade que representa uma Pessoa."""
    def __init__(self, pid, nome, fone, aniversario):
        self.pid = pid
        self.nome = nome
        self.fone = fone
        self.aniversario = aniversario

class PessoaModel:
    """Classe responsável pela persistência de dados de Pessoa no MongoDB."""
    def __init__(self, uri="mongodb://localhost:27017/", dbname="Aula04"):
        self.client = MongoClient(uri)
        self.db = self.client[dbname]
        self.collection = self.db["Pessoas"]

    def listar_todos(self):
        cursor = self.collection.find({}, {"_id": 0})
        return list(cursor)

    def criar_pessoa(self, pessoa: Pessoa):
        doc = {
            "id": self.next_val(),
            "nome": pessoa.nome,
            "fone": pessoa.fone,
            "aniversario": pessoa.aniversario
        }
        self.collection.insert_one(doc)

    def atualizar_pessoa(self, pessoa: Pessoa):
        result = self.collection.update_one(
            {"id": pessoa.pid},
            {"$set": {
                "nome": pessoa.nome,
                "fone": pessoa.fone,
                "aniversario": pessoa.aniversario
            }}
        )
        return result.modified_count  # 0 ou 1

    def deletar_pessoa(self, pid: int):
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
