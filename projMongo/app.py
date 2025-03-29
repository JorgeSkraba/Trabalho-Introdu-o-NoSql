# app.py
from flask import Flask, render_template
from route import pessoa_bp, medico_bp, agenda_bp

app = Flask(__name__)

# Registro do Blueprint de pessoas
app.register_blueprint(pessoa_bp)
app.register_blueprint(medico_bp)
app.register_blueprint(agenda_bp)

@app.route("/")
def index():
    # Renderiza a página inicial (index.html)
    return render_template("index.html")

@app.route("/view/pessoa")
def view_pessoa():
    # Retorna o conteúdo do template 'pessoa.html'
    # sem layout adicional
    return render_template("pessoa.html")

@app.route("/view/medico")
def view_medico():

    return render_template("medico.html")

@app.route("/view/agenda")
def view_agenda():

    return render_template("agenda.html")

@app.route("/view/teste")
def view_teste():

    return render_template("teste.html")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=85)