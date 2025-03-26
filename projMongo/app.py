# app.py
from flask import Flask, render_template
from route import pessoa_bp
from route import medico_bp

app = Flask(__name__)

# Registro do Blueprint de pessoas
app.register_blueprint(pessoa_bp)
app.register_blueprint(medico_bp)

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
    # Retorna o conteúdo do template 'pessoa.html'
    # sem layout adicional
    return render_template("medico.html")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=85)