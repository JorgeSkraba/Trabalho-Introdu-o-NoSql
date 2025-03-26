# route.py
from flask import Blueprint, request, jsonify
from CONTROLLER.PessoaController import PessoaController
from CONTROLLER.MedicoController import MedicoController

pessoa_bp = Blueprint("pessoa_bp", __name__)
medico_bp = Blueprint("medico_bp", __name__)
controller = PessoaController()
controller = MedicoController()

# GET /pessoas
@pessoa_bp.route("/pessoas", methods=["GET"])
def listar_pessoas():
    pessoas = controller.listar_pessoas()
    return jsonify(pessoas), 200

# POST /pessoas
@pessoa_bp.route("/pessoas", methods=["POST"])
def criar_pessoa():
    data = request.json  # Ex.: {"id": int, "nome": str, ...}
    controller.criar_pessoa(data)
    return jsonify({"mensagem": "Paciente inserida com sucesso!"}), 201

# PUT /pessoas/<pid>
@pessoa_bp.route("/pessoas/<int:pid>", methods=["PUT"])
def atualizar_pessoa(pid):
    data = request.json
    mod_count = controller.atualizar_pessoa(pid, data)
    if mod_count == 0:
        return jsonify({"erro": "Paciente não encontrada!"}), 404
    return jsonify({"mensagem": "Paciente atualizada com sucesso!"}), 200

# DELETE /pessoas/<pid>
@pessoa_bp.route("/pessoas/<int:pid>", methods=["DELETE"])
def deletar_pessoa(pid):
    del_count = controller.deletar_pessoa(pid)
    if del_count == 0:
        return jsonify({"erro": "Paciente não encontrada!"}), 404
    return jsonify({"mensagem": "Paciente deletada com sucesso!"}), 200
#=================================================================================


# GET /pessoas
@medico_bp.route("/medicos", methods=["GET"])
def listar_medicos():
    medicos = controller.listar_medicos()
    return jsonify(medicos), 200

# POST /pessoas
@medico_bp.route("/medicos", methods=["POST"])
def criar_medicos():
    data = request.json  # Ex.: {"id": int, "nome": str, ...}
    controller.criar_medico(data)
    return jsonify({"mensagem": "Medico inserida com sucesso!"}), 201

# PUT /pessoas/<pid>
@medico_bp.route("/medicos/<int:pid>", methods=["PUT"])
def atualizar_medico(pid):
    data = request.json
    mod_count = controller.atualizar_medico(pid, data)
    if mod_count == 0:
        return jsonify({"erro": "Medico não encontrada!"}), 404
    return jsonify({"mensagem": "Medico atualizada com sucesso!"}), 200

# DELETE /pessoas/<pid>
@medico_bp.route("/medico/<int:pid>", methods=["DELETE"])
def deletar_medico(pid):
    del_count = controller.deletar_medico(pid)
    if del_count == 0:
        return jsonify({"erro": "Medico não encontrada!"}), 404
    return jsonify({"mensagem": "Medico deletada com sucesso!"}), 200
