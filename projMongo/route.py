# route.py
from flask import Blueprint, request, jsonify
from CONTROLLER.PessoaController import PessoaController
from CONTROLLER.MedicoController import MedicoController
from CONTROLLER.AgendaController import AgendaController

pessoa_bp = Blueprint("pessoa_bp", __name__)
medico_bp = Blueprint("medico_bp", __name__)
agenda_bp = Blueprint("agenda_bp", __name__)
pessoa_controller = PessoaController()
medico_controller = MedicoController()
agenda_controller = AgendaController()

# GET /pessoas
@pessoa_bp.route("/pessoas", methods=["GET"])
def listar_pessoas():
    pessoas = pessoa_controller.listar_pessoas()
    return jsonify(pessoas), 200

# POST /pessoas
@pessoa_bp.route("/pessoas", methods=["POST"])
def criar_pessoa():
    data = request.json  # Ex.: {"id": int, "nome": str, ...}
    pessoa_controller.criar_pessoa(data)
    return jsonify({"mensagem": "Paciente inserida com sucesso!"}), 201

# PUT /pessoas/<pid>
@pessoa_bp.route("/pessoas/<int:pid>", methods=["PUT"])
def atualizar_pessoa(pid):
    data = request.json
    mod_count = pessoa_controller.atualizar_pessoa(pid, data)
    if mod_count == 0:
        return jsonify({"erro": "Paciente não encontrada!"}), 404
    return jsonify({"mensagem": "Paciente atualizada com sucesso!"}), 200

# DELETE /pessoas/<pid>
@pessoa_bp.route("/pessoas/<int:pid>", methods=["DELETE"])
def deletar_pessoa(pid):
    del_count = pessoa_controller.deletar_pessoa(pid)
    if del_count == 0:
        return jsonify({"erro": "Paciente não encontrada!"}), 404
    return jsonify({"mensagem": "Paciente deletada com sucesso!"}), 200
#=================================================================================


# GET /pessoas
@medico_bp.route("/medicos", methods=["GET"])
def listar_medicos():
    medicos = medico_controller.listar_medicos()
    return jsonify(medicos), 200

# POST /pessoas
@medico_bp.route("/medicos", methods=["POST"])
def criar_medicos():
    data = request.json  # Ex.: {"id": int, "nome": str, ...}
    medico_controller.criar_medico(data)
    return jsonify({"mensagem": "Medico inserida com sucesso!"}), 201

# PUT /pessoas/<pid>
@medico_bp.route("/medicos/<int:pid>", methods=["PUT"])
def atualizar_medico(pid):
    data = request.json
    mod_count = medico_controller.atualizar_medico(pid, data)
    if mod_count == 0:
        return jsonify({"erro": "Medico não encontrada!"}), 404
    return jsonify({"mensagem": "Medico atualizada com sucesso!"}), 200

# DELETE /pessoas/<pid>
@medico_bp.route("/medicos/<int:pid>", methods=["DELETE"])
def deletar_medico(pid):
    del_count = medico_controller.deletar_medico(pid)
    if del_count == 0:
        return jsonify({"erro": "Medico não encontrada!"}), 404
    return jsonify({"mensagem": "Medico deletada com sucesso!"}), 200
#=================================================================================


# GET /pessoas
@agenda_bp.route("/agendas", methods=["GET"])
def listar_agendas():
    agendas = agenda_controller.listar_agendas()
    return jsonify(agendas), 200

# POST /pessoas
@agenda_bp.route("/agendas", methods=["POST"])
def criar_agendas():
    data = request.json  # Ex.: {"id": int, "nome": str, ...}
    agenda_controller.criar_agenda(data)
    return jsonify({"mensagem": "Agendamento inserido com sucesso!"}), 201

# PUT /pessoas/<pid>
@agenda_bp.route("/agendas/<int:pid>", methods=["PUT"])
def atualizar_agenda(pid):
    data = request.json
    mod_count = agenda_controller.atualizar_agenda(pid, data)
    if mod_count == 0:
        return jsonify({"erro": "Registro não encontrado!"}), 404
    return jsonify({"mensagem": "Agenda atualizada com sucesso!"}), 200

# DELETE /pessoas/<pid>
@agenda_bp.route("/agendas/<int:pid>", methods=["DELETE"])
def deletar_agenda(pid):
    del_count = agenda_controller.deletar_agenda(pid)
    if del_count == 0:
        return jsonify({"erro": "Registro não encontrado!"}), 404
    return jsonify({"mensagem": "Registro deletado com sucesso!"}), 200
